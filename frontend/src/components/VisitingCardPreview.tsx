import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface EmployeeData {
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  photoUrl?: string | null;
}

interface Props {
  data: Partial<EmployeeData>;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

export const VisitingCardPreview: React.FC<Props> = ({ data, forwardedRef }) => {
  const {
    employeeId = 'MDX0001',
    name = 'YOUR NAME',
    designation = 'YOUR DESIGNATION',
    phone = '79771 21917',
    email = 'info@medoxnity.com',
  } = data;

  // Dynamic font sizing to prevent overflow on long names
  const nameFontSize = name.length > 22 ? 'text-sm' : name.length > 15 ? 'text-base' : 'text-lg';
  const emailFontSize = email.length > 25 ? 'text-[8.5px]' : 'text-[10px]';

  return (
    <div ref={forwardedRef} className="flex flex-col md:flex-row gap-8 items-center justify-center p-4 bg-gray-50">

      {/* FRONT SIDE (Brand identity, clean and corporate) */}
      <div className="w-[450px] h-[260px] bg-white rounded-xl shadow-lg overflow-hidden relative border border-gray-200 flex flex-col items-center justify-center font-sans select-none shrink-0">

        {/* Dynamic Curved Wave Backgrounds (Brand colors) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {/* Top Green Accent Wave */}
          <svg viewBox="0 0 450 100" className="absolute top-0 left-0 w-full h-[60px] fill-current text-green-600 opacity-90">
            <path d="M0,0 L450,0 L450,10 C350,40 250,5 0,35 Z" />
          </svg>
          {/* Top Blue Accent Wave */}
          <svg viewBox="0 0 450 100" className="absolute top-0 left-0 w-full h-[55px] fill-current text-[#0A2342]">
            <path d="M0,0 L450,0 L450,5 C350,30 250,-5 0,25 Z" />
          </svg>
          {/* Bottom Left Accent curves */}
          <svg viewBox="0 0 200 100" className="absolute bottom-0 left-0 w-[120px] h-[60px] fill-current text-green-600 opacity-95">
            <path d="M0,100 L200,100 C150,60 80,80 0,50 Z" />
          </svg>
          <svg viewBox="0 0 200 100" className="absolute bottom-0 left-0 w-[110px] h-[55px] fill-current text-[#0A2342]">
            <path d="M0,100 L200,100 C150,65 80,85 0,55 Z" />
          </svg>
        </div>

        {/* Logo and Slogan */}
        <div className="relative z-10 flex flex-col items-center px-6">
          <div className="h-[60px] flex items-center justify-center mb-2">
            <img 
              src="/placeholder-logo.png" 
              alt="Medoxnity Diagnostic" 
              className="h-full object-contain" 
            />
          </div>
          <div className="text-center">
            <p className="text-[12px] text-[#0A2342] font-bold tracking-wider leading-tight">Make Healthy Choices Today</p>
            <p className="text-[11px] text-gray-500 leading-tight">For A Happier Tomorrow</p>
            {/* Little separator leaf shape */}
            <div className="flex justify-center gap-1 mt-1.5">
              <span className="w-2.5 h-1.5 bg-green-600 rounded-full"></span>
              <span className="w-3.5 h-1.5 bg-green-600 rounded-full"></span>
              <span className="w-2.5 h-1.5 bg-green-600 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Small Bottom Right Details */}
        <div className="absolute bottom-3 right-4 z-10 flex items-center gap-1.5 text-gray-400 text-[9px] font-medium">
          <Globe className="w-3 h-3 text-green-600" />
          <span>www.medoxnity.com</span>
        </div>
      </div>

      {/* BACK SIDE (Employee details and dynamic QR code) */}
      <div className="w-[450px] h-[260px] bg-white rounded-xl shadow-lg overflow-hidden relative border border-gray-200 flex font-sans select-none shrink-0">

        {/* Curved Side Accents */}
        <div className="absolute top-0 right-0 h-full w-[80px] pointer-events-none z-0">
          {/* Top Right Green curve */}
          <svg viewBox="0 0 100 260" className="absolute top-0 right-0 h-full w-full fill-current text-green-600 opacity-90">
            <path d="M100,0 L100,260 C50,200 80,100 60,0 Z" />
          </svg>
          {/* Top Right Blue curve */}
          <svg viewBox="0 0 100 260" className="absolute top-0 right-0 h-full w-[70px] fill-current text-[#0A2342]">
            <path d="M100,0 L100,260 C60,200 90,100 70,0 Z" />
          </svg>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-7 py-6 flex flex-col justify-between z-10 min-w-0">
          {/* Top Logo row */}
          <div className="h-[36px] flex items-center justify-start shrink-0">
            <img 
              src="/placeholder-logo.png" 
              alt="Medoxnity Diagnostic" 
              className="h-full object-contain" 
            />
          </div>

          {/* Center Details */}
          <div className="flex gap-4 items-start my-auto">
            {/* Personal Details info */}
            <div className="flex-1 min-w-0">
              <h2 className={`${nameFontSize} font-extrabold text-[#0A2342] uppercase leading-tight tracking-wide truncate`}>
                {name || 'YOUR NAME'}
              </h2>
              <p className="text-[11px] text-green-600 font-bold uppercase tracking-wider leading-tight mt-0.5">
                {designation || 'YOUR DESIGNATION'}
              </p>
              <div className="w-12 h-[2px] bg-green-600 my-2"></div>

              {/* Contact Icons Column */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px]">
                  <Phone className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span className="font-bold text-gray-900">{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] min-w-0">
                  <Mail className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span className={`font-bold text-gray-900 truncate ${emailFontSize}`}>{email}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <Globe className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span className="font-bold text-gray-900">www.medoxnity.com</span>
                </div>
                <div className="flex items-start gap-2 text-[9px] leading-tight min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-gray-700 break-words">
                    C-111A, Punit Industrial Estate, Turbhe, Navi Mumbai - 400703
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic QR Code */}
            <div className="flex flex-col items-center shrink-0 pr-4 mt-2">
              <div className="w-[64px] h-[64px] border-2 border-green-600 p-0.5 bg-white flex items-center justify-center rounded-lg shadow-sm">
                <QRCodeSVG value={`https://www.medoxnity.com/profile/${employeeId}`} size={54} />
              </div>
              <span className="text-[8px] text-gray-400 mt-1 font-semibold uppercase tracking-wider">Scan Profile</span>
            </div>
          </div>

          {/* Bottom Authorized signature line */}
          <div className="flex justify-between items-end border-t border-gray-100 pt-2 shrink-0">
            <span className="text-[8px] text-gray-600 font-semibold">Employee ID: {employeeId}</span>
            <div className="flex flex-col items-center">
              <div className="h-6 flex items-center justify-center">
                <img
                  src="/placeholder-signature.jpeg"
                  alt="Signature"
                  className="h-full object-contain mix-blend-multiply"
                />
              </div>
              <div className="w-16 h-[0.5px] bg-gray-400"></div>
              <span className="text-[7px] text-gray-600 mt-0.5 tracking-tight font-semibold">Authorized Signatory</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
