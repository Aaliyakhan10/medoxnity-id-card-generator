import React from 'react';
import { User, Calendar, Droplet, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

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

export const IdCardPreview: React.FC<Props> = ({ data, forwardedRef }) => {
  const {
    employeeId = 'MDX0001',
    name = 'YOUR NAME',
    designation = 'YOUR DESIGNATION',
    dateOfJoining = '17-07-2025',
    bloodGroup = 'O+',
    phone = '79771 21917',
    email = 'info@medoxnity.com',
    photoUrl,
  } = data;

  // Dynamically adjust font sizes based on length to prevent aggressive trimming
  const nameFontSize = name.length > 22 ? 'text-xs' : name.length > 15 ? 'text-sm' : 'text-base';
  const designationFontSize = designation.length > 20 ? 'text-[9px]' : 'text-[10px]';

  return (
    <div ref={forwardedRef} className="flex flex-col md:flex-row gap-8 items-center justify-center p-4 bg-gray-50">
      {/* Front Side */}
      <div className="w-[320px] h-[490px] bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-200 flex flex-col font-sans select-none">

        {/* Top Header Background & Curved Waves */}
        <div className="absolute top-0 left-0 w-full h-[80px] overflow-hidden pointer-events-none z-0">
          {/* Top dark blue band */}
          <div className="w-full h-[25px] bg-[#0A2342] relative flex items-center justify-center">
            {/* Hanger slot */}
            <div className="w-14 h-2.5 bg-white rounded-full"></div>
          </div>
          {/* Wave curve overlay */}
          <svg viewBox="0 0 320 80" className="absolute top-[24px] left-0 w-full h-[25px] fill-current text-[#0A2342] z-10">
            <path d="M0,0 Q80,45 160,15 T320,0 L320,0 L0,0 Z" />
          </svg>
          <svg viewBox="0 0 320 80" className="absolute top-[25px] left-0 w-full h-[27px] fill-current text-green-600 z-0">
            <path d="M0,0 Q80,50 160,20 T320,0 L320,0 L0,0 Z" />
          </svg>
        </div>

        {/* Top Logo & Slogan Area */}
        <div className="relative z-20 pt-[56px] px-4 flex flex-col items-center shrink-0">
          <div className="h-[44px] flex items-center justify-center">
            <img
              src="/placeholder-logo.png"
              alt="Medoxnity Diagnostic"
              className="h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>

          <div className="text-center mt-1">
            <p className="text-[9px] text-[#0A2342] font-semibold tracking-wide leading-tight">Make Healthy Choices Today</p>
            <p className="text-[8.5px] text-gray-600 leading-tight">For A Happier Tomorrow</p>
            {/* Mini leaf ornament */}
            <div className="flex justify-center gap-0.5 mt-0.5">
              <span className="w-1.5 h-1 bg-green-600 rounded-full"></span>
              <span className="w-2 h-1 bg-green-600 rounded-full"></span>
              <span className="w-1.5 h-1 bg-green-600 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-6 pt-1 flex flex-col items-center w-full min-w-0 z-10">
          {/* Photo Section */}
          <div className="w-[85px] shrink-0 flex flex-col items-center">
            <div className="w-full h-[100px] rounded-xl overflow-hidden border-2 border-gray-300 shadow-sm bg-gray-100 flex items-center justify-center">
              {photoUrl ? (
                <img src={photoUrl} alt="Employee" className="w-full h-full object-cover" crossOrigin="anonymous" />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full flex flex-col min-w-0 mt-2">
            {/* Name and Designation */}
            <div className="mb-2 flex flex-col items-center text-center">
              <h2 className={`${nameFontSize} font-extrabold text-[#0A2342] uppercase leading-tight tracking-wide break-words max-h-[36px] overflow-hidden`}>
                {name || 'YOUR NAME'}
              </h2>
              <p className={`${designationFontSize} text-green-600 font-bold uppercase tracking-wider leading-tight mt-0.5`}>
                {designation || 'YOUR DESIGNATION'}
              </p>
              <div className="w-10 h-[1.5px] bg-green-600 mt-1"></div>
            </div>

            {/* List of Details */}
            <div className="space-y-1.5 w-full min-w-0 px-2">
              <div className="flex items-center gap-1.5 w-full min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0A2342] flex items-center justify-center shrink-0">
                  <User className="w-2 h-2 text-white" />
                </div>
                <div className="flex text-[9px] flex-1 min-w-0 items-center">
                  <span className="w-[65px] shrink-0 text-gray-700 font-medium">Employee ID</span>
                  <span className="shrink-0 mr-1 text-gray-500">:</span>
                  <span className="font-bold text-gray-800 truncate flex-1">{employeeId}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 w-full min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0A2342] flex items-center justify-center shrink-0">
                  <Calendar className="w-2 h-2 text-white" />
                </div>
                <div className="flex text-[9px] flex-1 min-w-0 items-center">
                  <span className="w-[65px] shrink-0 text-gray-700 font-medium">Date of Joining</span>
                  <span className="shrink-0 mr-1 text-gray-500">:</span>
                  <span className="font-bold text-gray-800 truncate flex-1">
                    {dateOfJoining ? new Date(dateOfJoining).toLocaleDateString('en-GB') : '17-07-2025'}
                  </span>
                </div>
              </div>

              {bloodGroup && (
                <div className="flex items-center gap-1.5 w-full min-w-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0A2342] flex items-center justify-center shrink-0">
                    <Droplet className="w-2 h-2 text-white" />
                  </div>
                  <div className="flex text-[9px] flex-1 min-w-0 items-center">
                    <span className="w-[65px] shrink-0 text-gray-700 font-medium">Blood Group</span>
                    <span className="shrink-0 mr-1 text-gray-500">:</span>
                    <span className="font-bold text-gray-800 truncate flex-1">{bloodGroup}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 w-full min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0A2342] flex items-center justify-center shrink-0">
                  <Phone className="w-2 h-2 text-white" />
                </div>
                <div className="flex text-[9px] flex-1 min-w-0 items-center">
                  <span className="w-[65px] shrink-0 text-gray-700 font-medium">Contact No.</span>
                  <span className="shrink-0 mr-1 text-gray-500">:</span>
                  <span className="font-bold text-gray-800 truncate flex-1">{phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 w-full min-w-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0A2342] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-2 h-2 text-white" />
                </div>
                <div className="flex flex-col text-[9px] flex-1 min-w-0 leading-tight">
                  <span className="text-gray-700 font-medium">Email ID</span>
                  <span className="font-bold text-gray-800 break-all text-[8.5px]">{email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="absolute bottom-[48px] left-6 z-20 flex flex-col items-center w-[70px]">
          <div className="h-6 flex items-center justify-center mb-0.5">
            <img
              src="/placeholder-signature.jpeg"
              alt="Signature"
              className="h-full object-contain mix-blend-multiply"
              crossOrigin="anonymous"
            />
          </div>
          <div className="w-full h-[1px] bg-gray-500"></div>
          <span className="text-[7px] text-gray-700 mt-0.5 tracking-tight font-semibold">Authorized Signatory</span>
        </div>

        {/* QR Code (Anchored bottom right, higher up to avoid overlapping curves) */}
        <div className="absolute bottom-[48px] right-6 z-20">
          <div className="w-[50px] h-[50px] border-2 border-green-600 p-0.5 bg-white flex items-center justify-center rounded-md shadow-sm">
            <QRCodeCanvas value={employeeId || 'MDX0001'} size={40} />
          </div>
        </div>

        {/* Bottom Curved Wave Footer */}
        <div className="relative w-full h-[48px] shrink-0 mt-auto overflow-hidden">
          {/* Green accent wave behind */}
          <div className="absolute bottom-[8px] left-0 w-full h-[36px] bg-green-600 rounded-t-[50%] scale-x-[1.2] origin-bottom z-0"></div>
          {/* Dark blue footer block */}
          <div className="absolute bottom-0 left-0 w-full h-[36px] bg-[#0A2342] rounded-t-[50%] scale-x-[1.1] origin-bottom z-10 flex items-center justify-center px-4">
            <div className="flex items-center justify-center gap-1.5 pb-1.5 z-20 w-full">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
              <p className="text-white text-[8px] leading-tight font-light truncate max-w-[85%] text-center">
                C-111A, Punit Industrial Estate, Turbhe, Navi Mumbai - 400703
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Back Side */}
      <div className="w-[320px] h-[490px] bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-200 flex flex-col font-sans select-none">

        {/* Top Header Background & Curved Waves */}
        <div className="absolute top-0 left-0 w-full h-[100px] overflow-hidden pointer-events-none z-0">
          {/* Top dark blue band */}
          <div className="w-full h-[40px] bg-[#0A2342] relative flex items-center justify-center">
            {/* Hanger slot */}
            <div className="w-14 h-2.5 bg-white rounded-full"></div>
          </div>
          {/* Back curves style */}
          <div className="absolute top-[40px] right-0 w-[80%] h-[50px] bg-[#0A2342] rounded-bl-[100%] z-10"></div>
          <div className="absolute top-[40px] right-0 w-[83%] h-[56px] bg-green-600 rounded-bl-[100%] z-0"></div>
        </div>

        {/* Back Logo */}
        <div className="relative z-20 pt-[48px] px-4 flex justify-center shrink-0">
          <div className="h-[36px] bg-white/95 rounded-lg px-3 py-1 flex items-center justify-center shadow-sm border border-gray-100">
            <img
              src="/placeholder-logo.png"
              alt="Medoxnity Diagnostic"
              className="h-full object-contain"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 px-6 pt-3 flex flex-col relative z-20">

          <div className="flex justify-center mb-3">
            <div className="bg-[#0A2342] text-white text-[9px] tracking-wider font-bold px-5 py-0.5 rounded-full">
              COMPANY DETAILS
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-[9.5px] text-gray-900 font-bold leading-tight">
                Medoxnity Diagnostic Pvt. Ltd.<br />
                C-111A, Punit Industrial Estate,<br />
                Turbhe, Navi Mumbai - 400703
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Globe className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-[9.5px] text-gray-900 font-bold">www.medoxnity.com</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Mail className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-[9.5px] text-gray-900 font-bold">info@medoxnity.com</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                <Phone className="w-2.5 h-2.5 text-white" />
              </div>
              <p className="text-[9.5px] text-gray-900 font-bold">79771 21917</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-green-600 my-3"></div>

          <div>
            <div className="bg-[#0A2342] text-white text-[9px] tracking-wider font-bold px-3 py-0.5 rounded-md inline-block mb-2">
              INSTRUCTIONS
            </div>
            <ul className="text-[8.5px] text-gray-900 space-y-1 list-disc pl-4 font-bold leading-tight">
              <li>This ID card is the property of Medoxnity Diagnostic Pvt. Ltd.</li>
              <li>This card is non-transferable.</li>
              <li>Please carry this card while on duty.</li>
              <li>Return this card to HR Department upon resignation or termination.</li>
              <li>If found, please return to the above address.</li>
            </ul>
          </div>

          {/* Watermark Logo behind content */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-[0.03] pointer-events-none z-[-1] flex justify-center w-full">
            <img src="/placeholder-logo.jpeg" alt="" className="w-40 h-40 object-contain" crossOrigin="anonymous" />
          </div>

          <div className="mt-auto flex justify-center pb-4">
            <div className="bg-[#C8102E] text-white text-[9px] font-bold px-5 py-1 rounded-full flex flex-col items-center leading-tight shadow-sm">
              <span>EMERGENCY CONTACT</span>
              <span>+91 79771 21917</span>
            </div>
          </div>
        </div>

        {/* Bottom straight footer */}
        <div className="w-full h-[48px] bg-[#0A2342] flex items-center justify-between px-5 shrink-0 relative z-20 border-t border-green-600">
          <div className="text-[9px] leading-tight">
            <div className="text-white">India's Health.</div>
            <div className="text-white">Our Mission.</div>
            <div className="text-green-500 font-bold">Your Success.</div>
          </div>

          <div className="flex flex-col items-center mt-1">
            <div className="h-5 flex items-center justify-center">
              {/* CSS filter invert + screen blend mode lets us turn a black-on-white signature into transparent white signature on dark blue background! */}
              <img
                src="/placeholder-signature.jpeg"
                alt="Signature"
                className="h-full object-contain invert mix-blend-screen"
                crossOrigin="anonymous"
              />
            </div>
            <div className="w-20 h-[0.5px] bg-white/40 mb-0.5"></div>
            <span className="text-[7.5px] text-white/70">Authorized Signatory</span>
          </div>
        </div>

      </div>
    </div>
  );
};
