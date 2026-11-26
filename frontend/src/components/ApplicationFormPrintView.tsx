import React, { useRef } from 'react';
import { 
  Printer, Download, User, 
  ExternalLink, FileDown, Files 
} from 'lucide-react';
import { resolveImageUrl } from '../lib/utils';
import { formatDate } from '../admin/lib/format';

export interface ApplicationFormPrintViewProps {
  data: any;
  isCandidatePreview?: boolean;
  isAdmin?: boolean;
  onPrint?: () => void;
  onUpdateStatus?: (newStatus: string) => Promise<void> | void;
  onDownloadAllDocs?: () => void;
  downloadingDocs?: boolean;
  docsList?: Array<{ label: string; url: string; category?: string }>;
  onDownloadSingleDoc?: (url: string, filename: string) => void;
}

export const ApplicationFormPrintView: React.FC<ApplicationFormPrintViewProps> = ({
  data = {},
  isCandidatePreview = false,
  isAdmin = false,
  onPrint,
  onUpdateStatus,
  onDownloadAllDocs,
  downloadingDocs = false,
  docsList = [],
  onDownloadSingleDoc,
}) => {
  const formRef = useRef<HTMLDivElement>(null);

  // Dedicated high-fidelity print handler: clones container into isolated iframe
  // to avoid parent modal clipping (overflow-hidden / fixed viewport) and guarantee background graphics
  const handlePrint = () => {
    const elem = formRef.current || document.getElementById('official-printable-application-form');
    if (!elem) {
      if (onPrint) onPrint();
      else window.print();
      return;
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!frameDoc) {
        if (onPrint) onPrint();
        else window.print();
        return;
      }

      // Collect all stylesheet links and style tags from current page
      const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n');

      const printHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <title>Application_Form_${data.registrationNumber || 'Candidate'}</title>
            ${styleSheets}
            <style>
              @page {
                size: A4 portrait;
                margin: 8mm 10mm;
              }
              *, *::before, *::after {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                background: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                height: auto !important;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
              }
              .printable-application-form {
                box-shadow: none !important;
                border: 1px solid #cbd5e1 !important;
                border-radius: 0 !important;
                padding: 16px !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 100% !important;
              }
              .no-print {
                display: none !important;
              }
              table, tr, td, th {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .border, [class*="rounded-xl"], [class*="rounded-2xl"] {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            </style>
          </head>
          <body class="bg-white p-2">
            ${elem.outerHTML}
          </body>
        </html>
      `;

      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();

      const triggerPrint = () => {
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (err) {
            console.error('Iframe print failed, falling back to window.print()', err);
            window.print();
          } finally {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 3000);
          }
        }, 350);
      };

      const images = frameDoc.images;
      if (!images || images.length === 0) {
        triggerPrint();
      } else {
        let loaded = 0;
        const total = images.length;
        const onImgDone = () => {
          loaded++;
          if (loaded >= total) triggerPrint();
        };
        for (let i = 0; i < total; i++) {
          if (images[i].complete) {
            loaded++;
          } else {
            images[i].onload = onImgDone;
            images[i].onerror = onImgDone;
          }
        }
        if (loaded >= total) {
          triggerPrint();
        } else {
          setTimeout(triggerPrint, 1200);
        }
      }
    } catch (err) {
      console.error('Print iframe error:', err);
      if (onPrint) onPrint();
      else window.print();
    }
  };

  const handleOpenFullPage = () => {
    const elem = formRef.current || document.getElementById('official-printable-application-form');
    if (!elem) return;
    const styleSheets = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join('\n');
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;
    const curRegNumber = data.registrationNumber || (isCandidatePreview ? 'PENDING' : 'REG');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Application Form — ${curRegNumber}</title>
          ${styleSheets}
          <style>
            body { background: #f1f5f9; padding: 24px 16px; font-family: ui-sans-serif, system-ui, sans-serif; }
            .printable-application-form { max-width: 900px; margin: 0 auto; background: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); border-radius: 16px; padding: 32px; }
            @media print {
              body { background: #ffffff !important; padding: 0 !important; }
              .printable-application-form { max-width: 100% !important; box-shadow: none !important; border-radius: 0 !important; padding: 12px !important; }
              .no-print-bar { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="no-print-bar" style="max-width: 900px; margin: 0 auto 16px auto; display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #fff; padding: 12px 18px; border-radius: 12px;">
            <span style="font-weight: 700; font-size: 13px;">Official Application Form — ${curRegNumber}</span>
            <button onclick="window.print()" style="padding: 8px 16px; background: #2563eb; color: #fff; border: 0; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em;">🖨️ Print / Save as PDF</button>
          </div>
          ${elem.outerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
  };
  // Helper to extract candidate photo
  const getPhotoSrc = () => {
    if (data.photo && typeof data.photo === 'object' && (data.photo instanceof Blob || data.photo instanceof File)) {
      try {
        return URL.createObjectURL(data.photo);
      } catch {
        return '';
      }
    }
    if (typeof data.photo === 'string' && data.photo) {
      return resolveImageUrl(data.photo);
    }
    if (data.photoUrl) {
      return resolveImageUrl(data.photoUrl);
    }
    return '';
  };

  const photoSrc = getPhotoSrc();

  // Helper to extract payment voucher
  const getVoucherSrc = () => {
    const v = data.paymentVoucher || data.payment?.voucher || data.payment?.voucherFile;
    if (v && typeof v === 'object' && (v instanceof Blob || v instanceof File)) {
      try {
        return URL.createObjectURL(v);
      } catch {
        return '';
      }
    }
    const url = data.paymentVoucherUrl || data.payment?.voucherUrl;
    if (url) return resolveImageUrl(url);
    return '';
  };

  const voucherSrc = getVoucherSrc();

  // Address normalizers
  const perm = data.permanentAddress || {};
  const permCountry = data.permanentCountry || perm.country || 'Nepal';
  const permProvince = data.permanentProvince || perm.province || '—';
  const permDistrict = data.permanentDistrict || perm.district || '—';
  const permMunicipality = data.permanentMunicipality || perm.municipality || '—';
  const permWard = data.permanentWard || perm.ward || '—';
  const permStreet = data.permanentStreet || perm.street || (data as any).village || (data as any).tole || data.oldStreet || '—';

  const old = data.oldPermanentAddress || {};
  const oldCountry = data.oldCountry || old.country || 'Nepal';
  const oldZone = data.oldZone || old.zone || '—';
  const oldDistrict = data.oldDistrict || old.district || '—';
  const oldMunicipality = data.oldMunicipality || old.municipality || '—';
  const oldWard = data.oldWard || old.ward || '—';
  const oldStreet = data.oldStreet || old.street || permStreet || '—';

  const mail = data.mailingAddress || {};
  const mailCountry = data.mailingCountry || mail.country || 'Nepal';
  const mailProvince = data.mailingProvince || mail.province || permProvince || '—';
  const mailDistrict = data.mailingDistrict || mail.district || permDistrict || '—';
  const mailMunicipality = data.mailingMunicipality || mail.municipality || permMunicipality || '—';
  const mailWard = data.mailingWard || mail.ward || permWard || '—';
  const mailStreet = data.mailingStreet || mail.street || permStreet || '—';
  const mailForeign = data.mailingForeignAddress || mail.foreignAddress || '';

  // Academic list
  const academicList = Array.isArray(data.academicDetails) ? data.academicDetails : [];
  // Training list
  const trainingList = Array.isArray(data.trainingEntries) ? data.trainingEntries : [];
  // Work list
  const workList = Array.isArray(data.workEntries) ? data.workEntries : [];

  // Names
  const fullNameEn = data.fullName || [data.title, data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ') || '—';
  const fullNameNp = data.fullNameNp || [data.firstNameNp, data.middleNameNp, data.lastNameNp].filter(Boolean).join(' ') || '—';

  const regNumber = data.registrationNumber || (isCandidatePreview ? 'PENDING SUBMISSION' : 'REG-NOT-ASSIGNED');
  const voucherNo = data.paymentVoucherNo || data.payment?.voucherNo || (data as any).voucherNo || '—';

  return (
    <div className="space-y-6">
      {/* ── Top Action Toolbar (Hidden during print) ── */}
      <div className="no-print bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-blue-400">Application Form</span>
            <span className="font-mono bg-blue-950 border border-blue-800 text-blue-200 text-xs px-2.5 py-0.5 rounded-md font-bold">
              {regNumber}
            </span>
            {data.status && (
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                data.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                data.status === 'verified' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                data.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                ● {data.status}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 font-medium">
            {isCandidatePreview 
              ? 'Review all your entered details. You can print or save a PDF copy before submitting.'
              : 'Official applicant profile with full details, tables, and document links.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {/* Main Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider transition shadow-md cursor-pointer"
            title="Print or Save Application Form as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>

          {/* Open Full Tab Button */}
          <button
            type="button"
            onClick={handleOpenFullPage}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white text-xs font-bold transition border border-slate-700 cursor-pointer"
            title="Open Application Form in Full Tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Open in New Tab</span>
          </button>

          {/* Admin Status Actions */}
          {isAdmin && onUpdateStatus && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateStatus('verified')}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-blue-300 border border-slate-700 transition cursor-pointer"
                title="Mark as Verified"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('approved')}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition cursor-pointer shadow-sm"
                title="Approve Application"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('rejected')}
                className="px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-xs font-bold text-white transition cursor-pointer"
                title="Reject Application"
              >
                Reject
              </button>
            </div>
          )}

          {/* Admin Download All Docs */}
          {isAdmin && onDownloadAllDocs && docsList.length > 0 && (
            <button
              type="button"
              onClick={onDownloadAllDocs}
              disabled={downloadingDocs}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition cursor-pointer"
              title="Download all uploaded candidate certificates"
            >
              <FileDown className="w-4 h-4 text-blue-400" />
              <span>{downloadingDocs ? 'Saving…' : `Docs (${docsList.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Printable Application Form Container ── */}
      <div 
        ref={formRef}
        id="official-printable-application-form"
        className="printable-application-form bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-slate-900"
      >
        
        {/* Header Strip with Hospital Branding */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
                🏥
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-blue-950 uppercase">
                  Dwarika Hospital Pvt. Ltd.
                </h1>
                <p className="text-sm font-bold text-slate-700 font-nepali">
                  श्री द्वारिका हस्पिटल प्रा. लि.
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Birgunj-04, Parsa, Nepal | Contact: +977-51-522222 | Email: info@dwarikahospital.com
                </p>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
              <span className="inline-block bg-blue-900 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider mb-1">
                Official Application Form
              </span>
              <div className="text-xs font-bold text-slate-800">
                Reg No: <span className="font-mono text-blue-900 font-black">{regNumber}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Entry Session: {data.entryYear || '2082 B.S.'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Candidate Basic Profile with Photo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Details (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2">1. Candidate Identity</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate Full Name (English)</span>
                  <strong className="text-slate-900 text-sm uppercase">{fullNameEn}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">उम्मेदवारको नाम (नेपाली)</span>
                  <strong className="text-slate-900 text-sm font-nepali">{fullNameNp}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Post / Designation Applied</span>
                  <strong className="text-blue-900 text-sm font-black">{data.postApplied || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Candidate User Category</span>
                  <strong className="text-slate-800">{data.userType || 'STUDENT'} {data.userTypeOther ? `(${data.userTypeOther})` : ''}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Date of Birth (AD / BS)</span>
                  <strong className="text-slate-800">{data.dobAD || '—'} A.D. {data.dobBS ? `(${data.dobBS} B.S.)` : ''}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Gender & Blood Group</span>
                  <strong className="text-slate-800">{data.gender || '—'} • {data.bloodGroup || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Marital Status & Religion</span>
                  <strong className="text-slate-800">{data.maritalStatus || 'Unmarried'} • {data.religion || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Nationality & Caste / Ethnicity</span>
                  <strong className="text-slate-800">{data.nationality || 'Nepali'} • {data.caste || data.casteGroup || '—'}</strong>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2">2. Contact Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Mobile Number</span>
                  <strong className="text-blue-900 font-mono text-sm">{data.mobile || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Email Address</span>
                  <strong className="text-slate-800 break-all">{data.email || '—'}</strong>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Phone / Alternate</span>
                  <strong className="text-slate-800">{data.phone || '—'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Box (1 col) */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-36 h-44 sm:w-40 sm:h-48 border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-slate-100 flex flex-col items-center justify-center p-1 text-center shadow-xs">
              {photoSrc ? (
                <img src={photoSrc} alt="Candidate Photo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="p-2 space-y-1">
                  <User className="w-10 h-10 text-slate-400 mx-auto" />
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">Passport Size Photo</span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase text-slate-400 mt-1.5 tracking-wider">Candidate Photo</span>
          </div>
        </div>

        {/* Section 2: Identification Documents */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2">3. Identification Documents</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Citizenship No.</span>
              <strong className="text-slate-900 font-mono">{data.citizenshipNo || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Citizenship Issue Date</span>
              <strong className="text-slate-800">{data.citizenshipIssueDate || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Issue District / Place</span>
              <strong className="text-slate-800 uppercase">{data.citizenshipIssuePlace || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">PAN Number</span>
              <strong className="text-slate-900 font-mono">{data.panNo || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">National ID (NID) No.</span>
              <strong className="text-slate-900 font-mono">{data.nIdNo || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Passport Number</span>
              <strong className="text-slate-900 font-mono">{data.passportNo || '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Passport Issue Details</span>
              <strong className="text-slate-800">{data.passportIssuePlace ? `${data.passportIssuePlace} (${data.passportIssueDate || '—'})` : '—'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Local ID / Other</span>
              <strong className="text-slate-800 font-mono">{data.localIdNo || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Section 3: Family Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2">4. Family Background</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Father's Name (English / नेपाली)</span>
              <strong className="text-slate-900 uppercase block">{data.fatherName || '—'}</strong>
              {data.fatherNameNp && <span className="text-slate-600 font-nepali block">{data.fatherNameNp}</span>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Mother's Name (English / नेपाली)</span>
              <strong className="text-slate-900 uppercase block">{data.motherName || '—'}</strong>
              {data.motherNameNp && <span className="text-slate-600 font-nepali block">{data.motherNameNp}</span>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Grandfather's Name (English / नेपाली)</span>
              <strong className="text-slate-900 uppercase block">{data.grandfatherName || '—'}</strong>
              {data.grandfatherNameNp && <span className="text-slate-600 font-nepali block">{data.grandfatherNameNp}</span>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Grandmother's Name</span>
              <strong className="text-slate-900 uppercase block">{data.grandmotherName || '—'}</strong>
              {data.grandmotherNameNp && <span className="text-slate-600 font-nepali block">{data.grandmotherNameNp}</span>}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Spouse's Name</span>
              <strong className="text-slate-900 uppercase block">{data.spouseName || '—'}</strong>
              {data.spouseNameNp && <span className="text-slate-600 font-nepali block">{data.spouseNameNp}</span>}
            </div>
          </div>
        </div>

        {/* Section 4: Address Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-900">5. Address Information</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Permanent (Current) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 block border-b border-slate-100 pb-1">
                Permanent Address (Current)
              </span>
              <div className="space-y-1">
                <p><span className="text-slate-500 font-semibold">Country:</span> <strong>{permCountry}</strong></p>
                <p><span className="text-slate-500 font-semibold">Province:</span> <strong>{permProvince}</strong></p>
                <p><span className="text-slate-500 font-semibold">District:</span> <strong>{permDistrict}</strong></p>
                <p><span className="text-slate-500 font-semibold">Municipality/GP:</span> <strong>{permMunicipality}</strong></p>
                <p><span className="text-slate-500 font-semibold">Ward No:</span> <strong>{permWard}</strong></p>
                <p className="pt-0.5 border-t border-slate-100"><span className="text-blue-900 font-bold uppercase text-[10px]">Village / Tole:</span> <strong className="text-slate-900 block">{permStreet}</strong></p>
              </div>
            </div>

            {/* Permanent (Old Citizenship) */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block border-b border-slate-100 pb-1">
                Permanent Address (Old Citizenship)
              </span>
              <div className="space-y-1">
                <p><span className="text-slate-500 font-semibold">Country:</span> <strong>{oldCountry}</strong></p>
                <p><span className="text-slate-500 font-semibold">Zone (अञ्चल):</span> <strong>{oldZone}</strong></p>
                <p><span className="text-slate-500 font-semibold">District:</span> <strong>{oldDistrict}</strong></p>
                <p><span className="text-slate-500 font-semibold">Municipality/VDC:</span> <strong>{oldMunicipality}</strong></p>
                <p><span className="text-slate-500 font-semibold">Ward No:</span> <strong>{oldWard}</strong></p>
                <p className="pt-0.5 border-t border-slate-100"><span className="text-blue-900 font-bold uppercase text-[10px]">Village / Tole:</span> <strong className="text-slate-900 block">{oldStreet}</strong></p>
              </div>
            </div>

            {/* Mailing Address */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 block border-b border-slate-100 pb-1">
                Mailing / Correspondence Address
              </span>
              <div className="space-y-1">
                <p><span className="text-slate-500 font-semibold">Country:</span> <strong>{mailCountry}</strong></p>
                <p><span className="text-slate-500 font-semibold">Province:</span> <strong>{mailProvince}</strong></p>
                <p><span className="text-slate-500 font-semibold">District:</span> <strong>{mailDistrict}</strong></p>
                <p><span className="text-slate-500 font-semibold">Municipality/GP:</span> <strong>{mailMunicipality}</strong></p>
                <p><span className="text-slate-500 font-semibold">Ward No:</span> <strong>{mailWard}</strong></p>
                <p className="pt-0.5 border-t border-slate-100"><span className="text-blue-900 font-bold uppercase text-[10px]">Village / Tole:</span> <strong className="text-slate-900 block">{mailStreet}</strong></p>
                {mailForeign && <p className="text-[11px] text-slate-500 italic">Foreign: {mailForeign}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Academic Qualifications Table */}
        <div className="space-y-2">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-900">6. Academic Qualifications</div>
          {academicList.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">No academic records provided.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-black text-[10px] uppercase tracking-wider">
                    <th className="p-2 border-r border-slate-300">S.N.</th>
                    <th className="p-2 border-r border-slate-300">Level</th>
                    <th className="p-2 border-r border-slate-300">Degree / Program</th>
                    <th className="p-2 border-r border-slate-300">School / College</th>
                    <th className="p-2 border-r border-slate-300">Board / University</th>
                    <th className="p-2 border-r border-slate-300">Passed Year</th>
                    <th className="p-2 border-r border-slate-300">Marks / GPA</th>
                    <th className="p-2">Division</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {academicList.map((ac: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 font-bold border-r border-slate-200">{ac.level || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{ac.degree || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{ac.school || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{ac.university || '—'}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{ac.passedYear || '—'}</td>
                      <td className="p-2 font-mono font-bold text-blue-900 border-r border-slate-200 text-center">{ac.markGpa || '—'}</td>
                      <td className="p-2 text-center">{ac.division || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 6: Council Registration Details */}
        {(data.councilDetails?.councilName || (data as any).councilName || data.councilDetails?.regNo || (data as any).councilRegNo) && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-2">7. Professional Council Registration</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Council Name</span>
                <strong className="text-slate-900 uppercase">{data.councilDetails?.councilName || (data as any).councilName || '—'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registration No.</span>
                <strong className="text-blue-900 font-mono font-black">{data.councilDetails?.regNo || (data as any).councilRegNo || '—'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registration Type</span>
                <strong className="text-slate-800 uppercase">{data.councilDetails?.type || (data as any).councilRegType || '—'}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Reg. Date / Validity</span>
                <strong className="text-slate-800">{data.councilDetails?.regDate || (data as any).councilRegDate || '—'}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Section 7: Training Details (if any) */}
        {trainingList.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-900">8. Training & Certifications</div>
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-black text-[10px] uppercase tracking-wider">
                    <th className="p-2 border-r border-slate-300">S.N.</th>
                    <th className="p-2 border-r border-slate-300">Training Name</th>
                    <th className="p-2 border-r border-slate-300">Recognized Institution</th>
                    <th className="p-2 border-r border-slate-300">Reg. No.</th>
                    <th className="p-2 border-r border-slate-300">Start Date</th>
                    <th className="p-2 border-r border-slate-300">End Date</th>
                    <th className="p-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trainingList.map((tr: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 font-bold border-r border-slate-200">{tr.name || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{tr.recognizedBy || '—'}</td>
                      <td className="p-2 font-mono border-r border-slate-200">{tr.regNo || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{tr.startDateAD || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{tr.endDateAD || '—'}</td>
                      <td className="p-2 text-center">
                        {[tr.durationYears && `${tr.durationYears}Y`, tr.durationMonths && `${tr.durationMonths}M`, tr.durationDays && `${tr.durationDays}D`].filter(Boolean).join(' ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 8: Work Experience (if any) */}
        {workList.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-blue-900">9. Work Experience</div>
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-black text-[10px] uppercase tracking-wider">
                    <th className="p-2 border-r border-slate-300">S.N.</th>
                    <th className="p-2 border-r border-slate-300">Organization</th>
                    <th className="p-2 border-r border-slate-300">Location</th>
                    <th className="p-2 border-r border-slate-300">Post / Role</th>
                    <th className="p-2 border-r border-slate-300">Start Date</th>
                    <th className="p-2 border-r border-slate-300">End Date</th>
                    <th className="p-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {workList.map((wk: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2 font-bold border-r border-slate-200">{wk.organization || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{[wk.municipality, wk.district, wk.country].filter(Boolean).join(', ') || '—'}</td>
                      <td className="p-2 font-semibold border-r border-slate-200">{wk.post || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{wk.startDateAD || '—'}</td>
                      <td className="p-2 border-r border-slate-200">{wk.endDateAD || '—'}</td>
                      <td className="p-2 text-center">
                        {[wk.durationYears && `${wk.durationYears}Y`, wk.durationMonths && `${wk.durationMonths}M`, wk.durationDays && `${wk.durationDays}D`].filter(Boolean).join(' ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 9: Payment Verification Details */}
        <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-200">
          <div className="text-[10px] font-black uppercase tracking-widest text-sky-950 mb-2">10. Application Fee & Payment Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 block">Payment Mode</span>
              <strong className="text-slate-900">{data.payment?.mode || 'eSewa / QR / Bank Transfer'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 block">Payment Voucher / Txn No.</span>
              <strong className="text-blue-900 font-mono font-black text-sm">{voucherNo}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-700 block">Payment Date</span>
              <strong className="text-slate-800">{data.payment?.paymentDate || data.paymentDate || '—'}</strong>
            </div>
          </div>

          {voucherSrc && (
            <div className="mt-3 pt-3 border-t border-sky-200/60 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-sky-800">Attached Receipt:</span>
              <a 
                href={voucherSrc} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-900 font-semibold underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Payment Receipt
              </a>
            </div>
          )}
        </div>

        {/* Section 10: Official Declaration & Signatures */}
        <div className="pt-4 border-t-2 border-slate-300 space-y-8">
          <div className="text-[11px] text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
            <strong>Applicant Declaration:</strong> I hereby declare that all information furnished in this application is true, complete, and accurate to the best of my knowledge and belief. If any information or document is found to be false, counterfeit, or forged at any stage, my application and appointment shall be cancelled automatically without any notice.
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2"></div>
              <p className="text-xs font-black uppercase text-slate-900">Candidate Signature</p>
              <p className="text-[10px] text-slate-500">Name: {fullNameEn}</p>
              <p className="text-[10px] text-slate-500">Date: {formatDate(data.submittedAt || data.createdAt) || '____/____/________'}</p>
            </div>

            <div className="space-y-1 text-center sm:text-right flex flex-col items-center sm:items-end">
              <div className="border-b border-slate-400 w-48 sm:w-56 mb-2"></div>
              <p className="text-xs font-black uppercase text-slate-900">Hospital Verification Officer</p>
              <p className="text-[10px] text-slate-500">Dwarika Hospital Administration</p>
              <p className="text-[10px] text-slate-500">Seal & Signature</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── Document Downloads Grid (Admin Only, Hidden during print) ── */}
      {isAdmin && docsList.length > 0 && (
        <div className="no-print p-5 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200/80 pb-2.5">
            <div className="flex items-center gap-2 font-bold text-blue-950 text-sm">
              <Files className="w-4 h-4 text-blue-600" />
              <span>Candidate Uploaded Documents ({docsList.length})</span>
            </div>
            {onDownloadAllDocs && (
              <button
                type="button"
                onClick={onDownloadAllDocs}
                disabled={downloadingDocs}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download All Documents</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {docsList.map((doc, idx) => {
              const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(doc.url) || doc.url.includes('images.unsplash.com');
              const ext = doc.url.split('.').pop()?.split('?')[0] || 'file';
              const cleanName = fullNameEn.replace(/[^a-zA-Z0-9_-]/g, '_');
              const filename = `${regNumber}_${cleanName}_${doc.label.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-blue-100 shadow-xs hover:border-blue-300 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {isImage ? (
                        <img src={doc.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-blue-700 font-mono">
                          {ext.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate" title={doc.label}>
                        {doc.label}
                      </p>
                      <span className="text-[10px] text-slate-500 capitalize">{doc.category || 'Certificate'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                      title="View in New Tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {onDownloadSingleDoc && (
                      <button
                        type="button"
                        onClick={() => onDownloadSingleDoc(doc.url, filename)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition cursor-pointer"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
