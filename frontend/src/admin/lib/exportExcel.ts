import * as XLSX from 'xlsx';
import { formatDate } from './format';
import { resolveImageUrl } from '../../lib/utils';

export function exportToExcel(
  moduleKey: string,
  moduleLabel: string,
  items: any[]
) {
  if (!items || !items.length) {
    throw new Error('No data available to export.');
  }

  let rows: any[] = [];
  let colWidths: { wch: number }[] = [];

  switch (moduleKey) {
    case 'medicines': {
      let totalStock = 0;
      let totalStockValue = 0;

      rows = items.map((m, idx) => {
        const stock = Number(m.stock) || 0;
        const rate = Number(m.rate) || 0;
        const costPrice = Number(m.costPrice) || 0;
        const stockValue = stock * rate;
        totalStock += stock;
        totalStockValue += stockValue;

        return {
          'S.N.': idx + 1,
          'Medicine Name': m.name || '',
          'Generic Name': m.genericName || '',
          'Brand Name': m.brandName || '',
          'Manufacturer / Company': m.companyName || '',
          'Supplier / Party': m.supplierName || '',
          'Category / Group': m.group || 'Medicine',
          'Form': m.form || 'Tab.',
          'Strength': m.strength || '',
          'Unit': m.unit || 'Pcs',
          'Cost Price (NPR)': costPrice,
          'Selling Rate / MRP (NPR)': rate,
          'Current Stock': stock,
          'Stock Status': m.stockStatus || (stock > 0 ? 'In Stock' : 'Out of Stock'),
          'Total Stock Value (NPR)': Math.round(stockValue * 100) / 100,
          'Status': m.status || 'published',
          'Last Updated': formatDate(m.updatedAt),
        };
      });

      // Append Prominent TOTAL Row at the bottom
      rows.push({
        'S.N.': 'TOTAL',
        'Medicine Name': `TOTAL: ${items.length} Medicines`,
        'Generic Name': '',
        'Brand Name': '',
        'Manufacturer / Company': '',
        'Supplier / Party': '',
        'Category / Group': '',
        'Form': '',
        'Strength': '',
        'Unit': '',
        'Cost Price (NPR)': '',
        'Selling Rate / MRP (NPR)': '',
        'Current Stock': totalStock,
        'Stock Status': `${items.filter((i) => (Number(i.stock) || 0) > 0).length} Available`,
        'Total Stock Value (NPR)': Math.round(totalStockValue * 100) / 100,
        'Status': '',
        'Last Updated': formatDate(new Date().toISOString()),
      });

      colWidths = [
        { wch: 8 },  // S.N.
        { wch: 28 }, // Medicine Name
        { wch: 25 }, // Generic Name
        { wch: 20 }, // Brand Name
        { wch: 22 }, // Company
        { wch: 22 }, // Supplier
        { wch: 16 }, // Category
        { wch: 10 }, // Form
        { wch: 12 }, // Strength
        { wch: 10 }, // Unit
        { wch: 16 }, // Cost Price
        { wch: 22 }, // Selling Rate
        { wch: 15 }, // Current Stock
        { wch: 16 }, // Stock Status
        { wch: 24 }, // Total Stock Value
        { wch: 14 }, // Status
        { wch: 18 }, // Last Updated
      ];
      break;
    }

    case 'doctors': {
      rows = items.map((d, idx) => ({
        'S.N.': idx + 1,
        'Staff ID': d.staffId || '',
        'Full Name': d.name || '',
        'Name (Nepali)': d.nameNp || '',
        'Specialty / Title': d.specialty || '',
        'Department': typeof d.department === 'object' ? d.department?.title : d.department || '',
        'Department Category': d.category || '',
        'NMC Number': d.nmcNo || '',
        'Qualification': d.qualification || '',
        'Email': d.email || '',
        'Phone': d.phone || '',
        'Bookable': d.isBookable !== false ? 'Yes' : 'No',
        'Status': d.status || 'published',
        'Sort Order': d.sortOrder || 0,
      }));
      colWidths = [
        { wch: 6 },
        { wch: 14 },
        { wch: 26 },
        { wch: 22 },
        { wch: 24 },
        { wch: 22 },
        { wch: 18 },
        { wch: 14 },
        { wch: 22 },
        { wch: 24 },
        { wch: 16 },
        { wch: 10 },
        { wch: 12 },
        { wch: 10 },
      ];
      break;
    }

    case 'staff': {
      rows = items.map((s, idx) => ({
        'S.N.': idx + 1,
        'Staff ID': s.staffId || '',
        'Full Name': s.name || '',
        'Name (Nepali)': s.nameNp || '',
        'Title / Designation': s.specialty || '',
        'Staff Category': s.teamCategory || '',
        'Department / Area': s.category || '',
        'Qualification': s.qualification || '',
        'Email': s.email || '',
        'Phone': s.phone || '',
        'Account Active': s.isActive !== false ? 'Yes' : 'No',
        'Assigned Permissions': Array.isArray(s.permissions) ? s.permissions.join(', ') : '',
        'Status': s.status || 'published',
      }));
      colWidths = [
        { wch: 6 },
        { wch: 14 },
        { wch: 26 },
        { wch: 22 },
        { wch: 24 },
        { wch: 22 },
        { wch: 20 },
        { wch: 22 },
        { wch: 24 },
        { wch: 16 },
        { wch: 14 },
        { wch: 30 },
        { wch: 12 },
      ];
      break;
    }

    case 'appointments': {
      rows = items.map((a, idx) => ({
        'S.N.': idx + 1,
        'Ticket ID': a.ticketId || '',
        'Patient Name': a.patientName || '',
        'Age / Gender': `${a.age || ''} ${a.gender ? `(${a.gender})` : ''}`.trim(),
        'Mobile Phone': a.phone || '',
        'Doctor Name': a.doctor?.name || a.doctorName || '',
        'Department': a.department?.title || a.departmentName || '',
        'Appointment Date': a.appointmentDate || '',
        'Time Slot': a.timeSlot || '',
        'Shift': a.shift || '',
        'Type': a.appointmentType || 'Regular',
        'Status': a.status || 'pending',
        'Payment Status': a.paymentStatus || 'unpaid',
        'Booked At': formatDate(a.createdAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 14 },
        { wch: 24 },
        { wch: 14 },
        { wch: 16 },
        { wch: 24 },
        { wch: 20 },
        { wch: 16 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 14 },
        { wch: 18 },
      ];
      break;
    }

    case 'registrations': {
      rows = items.map((r, idx) => ({
        'S.N.': idx + 1,
        'Registration No.': r.registrationNumber || '',
        'Entry Year': r.entryYear || '2082 B.S.',
        'Full Name': r.fullName || '',
        'Name (Nepali)': r.fullNameNp || '',
        'Post Applied': r.postApplied || '',
        'Candidate Type': r.userType || 'STUDENT',
        'Mobile Phone': r.mobile || '',
        'Email Address': r.email || '',
        'Gender': r.gender || '',
        'Blood Group': r.bloodGroup || '',
        'Citizenship No.': r.citizenshipNo || '',
        'DOB (AD)': r.dobAD || '',
        'DOB (BS)': r.dobBS || '',
        'Father Name': r.fatherName || '',
        'Mother Name': r.motherName || '',
        'Permanent Address': [
          r.permanentAddress?.street,
          r.permanentAddress?.ward ? `Ward ${r.permanentAddress.ward}` : '',
          r.permanentAddress?.municipality,
          r.permanentAddress?.district,
          r.permanentAddress?.province,
        ].filter(Boolean).join(', '),
        'Payment Mode': r.payment?.mode || 'eSewa / QR',
        'Voucher / Txn No.': r.paymentVoucherNo || r.payment?.voucherNo || '',
        'Status': r.status || 'pending',
        'Submitted Date': formatDate(r.createdAt),
        'Photo Document': resolveImageUrl(r.photoUrl),
        'Citizenship Front': resolveImageUrl(r.citizenshipFrontUrl),
        'Citizenship Back': resolveImageUrl(r.citizenshipBackUrl),
        'Payment Voucher Slip': resolveImageUrl(r.paymentVoucherUrl || r.payment?.voucherUrl),
        'Council Certificate': resolveImageUrl(r.councilDetails?.councilCertUrl),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 18 },
        { wch: 12 },
        { wch: 24 },
        { wch: 20 },
        { wch: 20 },
        { wch: 14 },
        { wch: 16 },
        { wch: 24 },
        { wch: 10 },
        { wch: 12 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        { wch: 30 },
        { wch: 16 },
        { wch: 20 },
        { wch: 12 },
        { wch: 18 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 },
        { wch: 35 },
      ];
      break;
    }

    case 'applicants': {
      rows = items.map((a, idx) => ({
        'S.N.': idx + 1,
        'Full Name': a.fullName || '',
        'Username / Login ID': a.username || '',
        'Password': a.password || '',
        'Mobile Phone': a.mobile || '',
        'Email Address': a.email || '',
        'Post Applied': a.postApplied || '',
        'Status': a.status || 'active',
        'Registered Online': a.isRegistered ? 'Yes' : 'No',
        'Linked Registration No': a.registrationNumber || '',
        'Admin Notes': a.notes || '',
        'Created At': formatDate(a.createdAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 24 },
        { wch: 20 },
        { wch: 16 },
        { wch: 16 },
        { wch: 24 },
        { wch: 20 },
        { wch: 12 },
        { wch: 16 },
        { wch: 22 },
        { wch: 26 },
        { wch: 18 },
      ];
      break;
    }

    case 'enquiries': {
      rows = items.map((e, idx) => ({
        'S.N.': idx + 1,
        'Sender Name': e.name || '',
        'Email Address': e.email || '',
        'Phone Number': e.phone || '',
        'Subject': e.subject || '',
        'Message': e.message || '',
        'Address': e.address || '',
        'Status': e.status || 'new',
        'Received Date': formatDate(e.createdAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 24 },
        { wch: 24 },
        { wch: 16 },
        { wch: 24 },
        { wch: 40 },
        { wch: 20 },
        { wch: 12 },
        { wch: 18 },
      ];
      break;
    }

    case 'patients': {
      rows = items.map((p, idx) => ({
        'S.N.': idx + 1,
        'Master ID': p.masterId || '',
        'Portal Username': p.username || '',
        'Full Name': p.name || '',
        'Age': p.age || '',
        'Gender': p.gender || '',
        'Blood Group': p.bloodGroup || '',
        'Mobile Phone': p.phone || '',
        'Email Address': p.email || '',
        'Address': p.address || '',
        'Registered Date': formatDate(p.createdAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 16 },
        { wch: 18 },
        { wch: 24 },
        { wch: 8 },
        { wch: 10 },
        { wch: 12 },
        { wch: 16 },
        { wch: 24 },
        { wch: 26 },
        { wch: 18 },
      ];
      break;
    }

    case 'labreports': {
      rows = items.map((l, idx) => ({
        'S.N.': idx + 1,
        'Report ID': l.reportId || '',
        'Patient Name': l.patientName || '',
        'Master ID / Username': l.masterId || l.patientUsername || '',
        'Department': l.department || 'Laboratory',
        'Test Name': l.testName || '',
        'Priority': l.priority || 'Normal',
        'Test Date': l.testDate || '',
        'Status': l.status || 'Ready',
        'PDF Report Link': resolveImageUrl(l.pdfUrl),
        'Created Date': formatDate(l.createdAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 16 },
        { wch: 24 },
        { wch: 20 },
        { wch: 18 },
        { wch: 26 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 35 },
        { wch: 18 },
      ];
      break;
    }

    case 'insurance': {
      rows = items.map((ins, idx) => ({
        'S.N.': idx + 1,
        'Insurance Partner': ins.title || ins.name || '',
        'Company Name': ins.companyName || ins.title || '',
        'Contact Person': ins.contactPerson || '',
        'Phone Number': ins.phone || '',
        'Email Address': ins.email || '',
        'Website': ins.website || '',
        'Cashless Available': ins.isCashless !== false ? 'Yes' : 'No',
        'Status': ins.status || 'published',
        'Last Updated': formatDate(ins.updatedAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 26 },
        { wch: 26 },
        { wch: 20 },
        { wch: 16 },
        { wch: 24 },
        { wch: 24 },
        { wch: 16 },
        { wch: 12 },
        { wch: 18 },
      ];
      break;
    }

    case 'partners': {
      rows = items.map((p, idx) => ({
        'S.N.': idx + 1,
        'Partner Name': p.title || p.name || '',
        'Organization Type': p.type || p.category || 'Hospital Partner',
        'Phone Number': p.phone || '',
        'Email Address': p.email || '',
        'Website URL': p.website || '',
        'Address': p.address || '',
        'Status': p.status || 'published',
        'Last Updated': formatDate(p.updatedAt),
      }));
      colWidths = [
        { wch: 6 },
        { wch: 26 },
        { wch: 22 },
        { wch: 16 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 12 },
        { wch: 18 },
      ];
      break;
    }

    default: {
      // Dynamic fallback for any other CMS module
      rows = items.map((item, idx) => {
        const row: Record<string, any> = { 'S.N.': idx + 1 };
        Object.entries(item).forEach(([k, v]) => {
          if (['_id', '__v', 'fullContent', 'contentHtml', 'requirementsHtml', 'responsibilitiesHtml'].includes(k)) return;
          if (typeof v === 'object' && v !== null) {
            row[k] = JSON.stringify(v);
          } else {
            row[k] = v ?? '';
          }
        });
        return row;
      });
      break;
    }
  }

  // Create Workbook and Sheet
  const worksheet = XLSX.utils.json_to_sheet(rows);
  if (colWidths.length) {
    worksheet['!cols'] = colWidths;
  }

  const workbook = XLSX.utils.book_new();
  const safeSheetName = moduleLabel.slice(0, 31).replace(/[\\/?*[\]]/g, '');
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName || 'Data');

  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanFilename = `${moduleLabel.replace(/[\s/\\?%*:|"<>]+/g, '_')}_${dateStr}.xlsx`;

  XLSX.writeFile(workbook, cleanFilename);
}

export type RegistrationDocument = {
  label: string;
  url: string;
  category: 'identity' | 'payment' | 'council' | 'academic' | 'other';
};

export function getRegistrationDocuments(r: any): RegistrationDocument[] {
  if (!r) return [];
  const docs: RegistrationDocument[] = [];

  if (r.photoUrl) {
    docs.push({ label: 'Passport Photo', url: resolveImageUrl(r.photoUrl), category: 'identity' });
  }
  if (r.signatureUrl) {
    docs.push({ label: 'Applicant Signature', url: resolveImageUrl(r.signatureUrl), category: 'identity' });
  }
  if (r.citizenshipFrontUrl) {
    docs.push({ label: 'Citizenship (Front)', url: resolveImageUrl(r.citizenshipFrontUrl), category: 'identity' });
  }
  if (r.citizenshipBackUrl) {
    docs.push({ label: 'Citizenship (Back)', url: resolveImageUrl(r.citizenshipBackUrl), category: 'identity' });
  }
  if (r.panFileUrl) {
    docs.push({ label: 'PAN Document', url: resolveImageUrl(r.panFileUrl), category: 'identity' });
  }
  if (r.passportFileUrl) {
    docs.push({ label: 'Passport Document', url: resolveImageUrl(r.passportFileUrl), category: 'identity' });
  }
  if (r.nIdFileUrl) {
    docs.push({ label: 'National ID Document', url: resolveImageUrl(r.nIdFileUrl), category: 'identity' });
  }
  if (r.localIdFileUrl) {
    docs.push({ label: 'Local ID / Recommendation', url: resolveImageUrl(r.localIdFileUrl), category: 'identity' });
  }

  const voucherUrl = r.paymentVoucherUrl || r.payment?.voucherUrl;
  if (voucherUrl) {
    docs.push({ label: 'Payment Voucher Slip', url: resolveImageUrl(voucherUrl), category: 'payment' });
  }

  if (r.councilDetails?.councilCertUrl) {
    docs.push({
      label: `${r.councilDetails.councilName || 'Council'} Certificate`,
      url: resolveImageUrl(r.councilDetails.councilCertUrl),
      category: 'council',
    });
  }

  if (Array.isArray(r.academicDetails)) {
    r.academicDetails.forEach((ac: any, i: number) => {
      const lvl = ac.level || `Degree ${i + 1}`;
      if (ac.markSheetUrl) {
        docs.push({ label: `${lvl} Marksheet / Transcript`, url: resolveImageUrl(ac.markSheetUrl), category: 'academic' });
      }
      if (ac.characterCertUrl) {
        docs.push({ label: `${lvl} Character Certificate`, url: resolveImageUrl(ac.characterCertUrl), category: 'academic' });
      }
      if (ac.provisionalCertUrl) {
        docs.push({ label: `${lvl} Provisional Certificate`, url: resolveImageUrl(ac.provisionalCertUrl), category: 'academic' });
      }
    });
  }

  return docs;
}

export async function downloadDocument(url: string, suggestedFilename: string) {
  if (!url) return;
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network error');
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = suggestedFilename || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch {
    // Direct download fallback
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = suggestedFilename || 'document';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadAllRegistrationDocuments(r: any) {
  const docs = getRegistrationDocuments(r);
  if (!docs.length) {
    throw new Error('No uploaded documents found for this applicant.');
  }

  const cleanName = (r.fullName || 'Applicant').replace(/[^a-zA-Z0-9_-]/g, '_');
  const regNo = (r.registrationNumber || 'REG').replace(/[^a-zA-Z0-9_-]/g, '_');

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const ext = doc.url.split('.').pop()?.split('?')[0] || 'jpg';
    const filename = `${regNo}_${cleanName}_${doc.label.replace(/[^a-zA-Z0-9_-]/g, '_')}.${ext}`;

    await downloadDocument(doc.url, filename);
    // Slight delay between multiple file downloads to prevent browser popup block
    if (i < docs.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 450));
    }
  }
}
