import { MapPin, Phone, Mail, Globe, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Card } from './Card';

const ContactInfoSection = () => {
  return (
    <section id="contact" className="bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-primary mb-4">
              Contact Information
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              {/* Address */}
              <li>
                <a
                  href="https://maps.google.com/?q=Kalyanpur,+Khadak+Municipality,+Saptari,+Nepal"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 hover:text-primary transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-700">Address</p>
                    <p>Kalyanpur, Khadak Municipality, Ward No.-7,</p>
                    <p>Saptari, Madhesh Province, Nepal</p>
                    <p className="mt-1 text-slate-500 text-xs">
                      कल्याणपुर, खडक नगरपालिका-७, सप्‍तरी, मधेश प्रदेश, नेपाल
                    </p>
                  </div>
                </a>
              </li>
              {/* Phone */}
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700">Phone</p>
                  <a href="tel:031590123" className="hover:text-primary transition-colors">031-590123</a>
                  <span className="mx-2 text-slate-300">|</span>
                  <a href="tel:9705490123" className="hover:text-primary transition-colors">9705490123</a>
                </div>
              </li>
              {/* Email */}
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700">Email</p>
                  <a href="mailto:dwarikahospital15@gmail.com" className="hover:text-primary transition-colors">
                    dwarikahospital15@gmail.com
                  </a>
                </div>
              </li>
              {/* Website */}
              <li className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-primary mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700">Website</p>
                  <a href="https://www.dhama.com.np" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                    www.dhama.com.np
                  </a>
                </div>
              </li>
            </ul>
          </Card>

          {/* Social Links */}
          <Card>
            <h3 className="text-xs font-black uppercase tracking-[0.28em] text-primary mb-3">
              Stay Connected At
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="https://www.facebook.com/61573322175633/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://wa.me/9779705490123" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/dwarikahospital15/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-600 transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </li>
            </ul>
          </Card>
        </div>

        {/* Google Map Embed */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 min-h-[380px]">
          <iframe
            title="Dwarika Hospital Location"
            src="https://maps.google.com/maps?q=Kalyanpur%2C+Khadak+Municipality%2C+Saptari%2C+Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '380px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactInfoSection;
