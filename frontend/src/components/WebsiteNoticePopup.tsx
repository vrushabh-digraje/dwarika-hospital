import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { resolveImageUrl } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export interface PopupNoticeData {
  enabled: boolean;
  title?: string;
  titleNp?: string;
  message?: string;
  messageNp?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  displayType?: 'image_only' | 'text_only' | 'image_and_text';
  frequency?: 'always' | 'once_per_session' | 'once_per_day';
  showCloseButton?: boolean;
}

export default function WebsiteNoticePopup() {
  const [popup, setPopup] = useState<PopupNoticeData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const langCode = (i18n.resolvedLanguage ?? i18n.language ?? 'en').split('-')[0].toLowerCase();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const fetchPopup = async () => {
      try {
        const res = await fetch('/api/public/popup-notice');
        if (!res.ok) return;
        const json = await res.json();
        const data: PopupNoticeData = json?.data || json;

        if (!data || !data.enabled) return;

        // Check frequency rules
        const frequency = data.frequency || 'once_per_session';

        if (frequency === 'once_per_session') {
          const dismissed = sessionStorage.getItem('dwarika_popup_dismissed');
          if (dismissed) return;
        } else if (frequency === 'once_per_day') {
          const dismissedTime = localStorage.getItem('dwarika_popup_dismissed_time');
          if (dismissedTime) {
            const timeDiff = Date.now() - Number(dismissedTime);
            // 24 hours in milliseconds: 86,400,000
            if (timeDiff < 24 * 60 * 60 * 1000) return;
          }
        }

        setPopup(data);
        // Small delay so page renders first, then popup smoothly appears
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 900);
      } catch {
        // Ignore network errors
      }
    };

    fetchPopup();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (!popup) return;

    const frequency = popup.frequency || 'once_per_session';
    if (frequency === 'once_per_session') {
      sessionStorage.setItem('dwarika_popup_dismissed', 'true');
    } else if (frequency === 'once_per_day') {
      localStorage.setItem('dwarika_popup_dismissed_time', String(Date.now()));
    }
  };

  const handleActionClick = () => {
    handleClose();
    if (popup?.buttonLink) {
      if (popup.buttonLink.startsWith('http')) {
        window.open(popup.buttonLink, '_blank', 'noreferrer');
      } else {
        navigate(popup.buttonLink);
      }
    }
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !popup || !popup.enabled) return null;

  const displayType = popup.displayType || 'image_and_text';
  const isImageOnly = displayType === 'image_only';
  const isTextOnly = displayType === 'text_only';

  const title =
    langCode === 'np'
      ? (popup.titleNp || popup.title || '')
      : (popup.title || popup.titleNp || '');

  const message =
    langCode === 'np'
      ? (popup.messageNp || popup.message || '')
      : (popup.message || popup.messageNp || '');

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-white/20 text-left my-auto animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        {popup.showCloseButton !== false && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
            title="Close Notice"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Top Header Pill for Text / Combined Notice */}
        {!isImageOnly && (
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-5 py-2.5 flex items-center justify-between text-xs font-bold tracking-wide shadow-sm">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Hospital Announcement / विशेष सूचना</span>
            </span>
          </div>
        )}

        {/* Banner Flyer Image */}
        {!isTextOnly && popup.imageUrl && (
          <div
            className={`w-full overflow-hidden bg-slate-900 relative ${
              isImageOnly ? 'max-h-[85vh] cursor-pointer' : 'max-h-72 sm:max-h-80'
            }`}
            onClick={isImageOnly && popup.buttonLink ? handleActionClick : undefined}
          >
            <img
              src={resolveImageUrl(popup.imageUrl)}
              alt={title || 'Notice Flyer'}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Notice Content Body */}
        {!isImageOnly && (
          <div className="p-5 sm:p-6 space-y-3.5">
            {title && (
              <h3 className="font-display text-lg sm:text-xl font-black text-ink-900 leading-snug">
                {title}
              </h3>
            )}

            {message && (
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-line">
                {message}
              </p>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ink-100">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-ink-400 hover:text-ink-700 font-semibold cursor-pointer"
              >
                Dismiss / बन्द गर्नुहोस्
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {popup.buttonText && (
                  <button
                    type="button"
                    onClick={handleActionClick}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    <span>{popup.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button Strip if Image Only with Link */}
        {isImageOnly && popup.buttonText && (
          <div className="p-3 bg-white border-t border-ink-100 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-ink-400 hover:text-ink-700 font-semibold"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleActionClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
            >
              <span>{popup.buttonText}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
