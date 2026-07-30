import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { Search, Calculator, Printer, Download, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// Helper function to convert numbers to English words
function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const g = ['', 'Thousand', 'Million', 'Billion'];

  const makeGroup = (n: number) => {
    let s = '';
    const h = Math.floor(n / 100);
    const t = n % 100;
    if (h) s += a[h] + ' Hundred ';
    if (t) {
      if (s) s += 'and ';
      if (t < 20) s += a[t];
      else s += b[Math.floor(t / 10)] + (t % 10 ? '-' + a[t % 10] : '');
    }
    return s.trim();
  };

  let word = '';
  let i = 0;
  let tempNum = Math.floor(num);
  while (tempNum > 0) {
    const group = tempNum % 1000;
    if (group) {
      const groupWord = makeGroup(group);
      word = groupWord + (g[i] ? ' ' + g[i] : '') + (word ? ' ' + word : '');
    }
    tempNum = Math.floor(tempNum / 1000);
    i++;
  }
  return word.trim() + ' Only';
}

export default function SalarySlips() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Salary slip input states
  const [basicSalary, setBasicSalary] = useState<number>(45000);
  const [lopDays, setLopDays] = useState<number>(0);
  const [month, setMonth] = useState<string>('July');
  const [year, setYear] = useState<string>('2026');
  const [paymentMode, setPaymentMode] = useState<string>('Bank Transfer');
  const [bankName, setBankName] = useState<string>('HDFC Bank Ltd');
  const [accountNo, setAccountNo] = useState<string>('XXXXXXXXXX5412');

  // Ref for print/pdf capture
  const payslipRef = useRef<HTMLDivElement>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/employees?search=${search}`);
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEmployees();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Handle printing
  const handlePrint = useReactToPrint({
    contentRef: payslipRef,
  });

  // Handle PDF Export
  const handleDownloadPDF = async () => {
    if (!payslipRef.current) return;
    try {
      const width = payslipRef.current.offsetWidth;
      const height = payslipRef.current.offsetHeight;
      const imgData = await toPng(payslipRef.current, { pixelRatio: 4 });
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${selectedEmployee?.employeeId || 'employee'}-payslip-${month}-${year}.pdf`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to generate PDF: ${err.message || String(err)}`);
    }
  };

  // Handle Image Export
  const handleDownloadImage = async () => {
    if (!payslipRef.current) return;
    try {
      const imgData = await toPng(payslipRef.current, { pixelRatio: 4 });
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${selectedEmployee?.employeeId || 'employee'}-payslip-${month}-${year}.png`;
      link.click();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to generate Image: ${err.message || String(err)}`);
    }
  };

  // Calculations
  const grossEarnings = basicSalary;
  const calculatedLOP = Math.round((basicSalary / 30) * lopDays);
  const totalDeductions = calculatedLOP;
  const netSalary = grossEarnings - totalDeductions;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {!selectedEmployee ? (
        // Grid View of Employees
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Salary Slip Generator</h1>
              <p className="text-sm text-gray-500 mt-1">Select an employee to compute and generate their monthly payslip.</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">Loading employees...</div>
            ) : employees.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">No employees found.</div>
            ) : (
              employees.map((emp) => (
                <div key={emp.id} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center transition-colors">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-3 border border-gray-300">
                    {emp.photoUrl ? (
                      <img src={emp.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl uppercase">
                        {emp.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 truncate max-w-full">{emp.name}</h3>
                  <p className="text-xs text-gray-500 font-medium truncate max-w-full">{emp.designation}</p>
                  <p className="text-[10px] text-blue-600 font-semibold mt-1 bg-blue-50 px-2 py-0.5 rounded-full">{emp.employeeId}</p>

                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="mt-4 w-full py-2 px-3 bg-[#0A2342] text-white rounded-md text-xs font-bold hover:bg-[#16365f] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Generate Payslip
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // Generator Screen
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Controls Panel */}
          <div className="w-full lg:w-[350px] shrink-0 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
            <button
              onClick={() => setSelectedEmployee(null)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0A2342] hover:text-green-600 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Employees
            </button>

            <h2 className="text-lg font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">Payslip Variables</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Basic Salary (Monthly)</label>
                <input
                  type="number"
                  value={basicSalary}
                  onChange={(e) => setBasicSalary(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Loss of Pay (LOP) Days</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={lopDays}
                  onChange={(e) => setLopDays(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Mode</label>
                <select 
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm font-semibold focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {paymentMode === 'Bank Transfer' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bank Name</label>
                    <input 
                      type="text" 
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Bank Account No.</label>
                    <input 
                      type="text" 
                      value={accountNo}
                      onChange={(e) => setAccountNo(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm font-semibold"
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm font-semibold"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm font-semibold"
                  >
                    {['2025', '2026', '2027', '2028'].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-[#0A2342] text-white font-bold rounded-lg hover:bg-slate-800 text-sm shadow-sm transition-all"
              >
                <Printer className="w-4 h-4" /> Print Payslip
              </button>
              <button
                onClick={handleDownloadPDF}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 text-sm shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={handleDownloadImage}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 text-sm shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download PNG
              </button>
            </div>
          </div>

          {/* Payslip View Panel */}
          <div className="flex-1 bg-gray-100 p-6 rounded-xl border border-gray-200 overflow-x-auto flex justify-center items-start">

            {/* PAYSLIP SHEET CANVAS */}
            <div
              ref={payslipRef}
              className="w-[790px] bg-white p-8 border border-gray-300 rounded-md font-sans shadow-md text-gray-800 flex flex-col shrink-0"
              style={{ minHeight: '1000px' }}
            >
              {/* Header logo & company info */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-green-600">
                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 shrink-0 relative flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="44" fill="none" stroke="#22c55e" strokeWidth="6" />
                      <path d="M50,6 C40,20 40,40 50,44 C60,40 60,20 50,6 Z" fill="#22c55e" opacity="0.8" />
                      <path d="M50,94 C40,80 40,60 50,56 C60,60 60,80 50,94 Z" fill="#22c55e" opacity="0.8" />
                      <path d="M26,72 L40,32 L50,56 L60,32 L74,72" fill="none" stroke="#0A2342" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="47" y="38" width="6" height="24" rx="3" fill="#0A2342" />
                      <rect x="45" y="36" width="10" height="3" rx="1" fill="#0A2342" />
                      <circle cx="50" cy="56" r="2" fill="#22c55e" />
                    </svg>
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-2xl font-black text-[#0A2342] tracking-tight">Medoxnity</span>
                    <span className="text-[9px] tracking-[0.2em] text-green-600 font-extrabold mt-1">DIAGNOSTIC</span>
                  </div>
                </div>
                <div className="text-right text-[11px] leading-snug font-medium text-gray-500">
                  <p className="font-bold text-[#0A2342] text-sm">Medoxnity Diagnostic Pvt. Ltd.</p>
                  <p>C-111A, Punit Industrial Estate, Turbhe, Navi Mumbai - 400703</p>
                  <p>Website: www.medoxnity.com | Email: info@medoxnity.com</p>
                </div>
              </div>

              {/* Title */}
              <div className="text-center my-6">
                <h2 className="text-base font-black text-[#0A2342] uppercase tracking-wider">
                  Payslip for the month of {month} {year}
                </h2>
              </div>

              {/* Employee Metadata Summary */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-8 text-xs border border-gray-200 p-4 bg-gray-50/50 rounded-lg mb-6">
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">Employee Name</span>
                  <span className="font-bold text-gray-900">: {selectedEmployee.name}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">{paymentMode === 'Cash' ? 'Payment Mode' : 'Bank Name'}</span>
                  <span className="font-bold text-gray-900">: {paymentMode === 'Cash' ? 'Cash' : bankName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">Employee ID</span>
                  <span className="font-bold text-gray-900">: {selectedEmployee.employeeId}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">{paymentMode === 'Cash' ? 'Payment Ref' : 'Bank Account No.'}</span>
                  <span className="font-bold text-gray-900">: {paymentMode === 'Cash' ? 'Cash Payout' : accountNo}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">Designation</span>
                  <span className="font-bold text-gray-900">: {selectedEmployee.designation}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">PAN</span>
                  <span className="font-bold text-gray-900">: XXXXXX541P</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">Department</span>
                  <span className="font-bold text-gray-900">: {selectedEmployee.department}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-500 font-semibold">Date of Joining</span>
                  <span className="font-bold text-gray-900">
                    : {selectedEmployee.dateOfJoining ? new Date(selectedEmployee.dateOfJoining).toLocaleDateString('en-GB') : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Attendance Block */}
              <div className="border border-gray-200 rounded-lg mb-6 flex text-xs divide-x divide-gray-200">
                <div className="flex-1 p-2 text-center">
                  <p className="text-gray-500 font-semibold">Calendar Days</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">30</p>
                </div>
                <div className="flex-1 p-2 text-center">
                  <p className="text-gray-500 font-semibold">Paid Days</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{Math.max(0, 30 - lopDays)}</p>
                </div>
                <div className="flex-1 p-2 text-center bg-red-50/30">
                  <p className="text-red-700 font-semibold">LOP Days</p>
                  <p className="font-bold text-red-700 text-sm mt-0.5">{lopDays}</p>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6 flex divide-x divide-gray-200">
                {/* Earnings Column */}
                <div className="flex-1 flex flex-col">
                  <div className="bg-[#0A2342] text-white text-xs font-bold py-2.5 px-4 flex justify-between">
                    <span>EARNINGS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="flex-1 text-xs divide-y divide-gray-100">
                    <div className="py-2.5 px-4 flex justify-between">
                      <span className="font-semibold text-gray-600">Basic Salary</span>
                      <span className="font-bold text-gray-800">₹{basicSalary.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions Column */}
                <div className="flex-1 flex flex-col">
                  <div className="bg-[#0A2342] text-white text-xs font-bold py-2.5 px-4 flex justify-between">
                    <span>DEDUCTIONS</span>
                    <span>AMOUNT (₹)</span>
                  </div>
                  <div className="flex-1 text-xs divide-y divide-gray-100">
                    <div className="py-2.5 px-4 flex justify-between">
                      <span className="font-semibold text-red-600">Loss of Pay (LOP) Deduction</span>
                      <span className="font-bold text-red-600">₹{calculatedLOP.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="border border-gray-200 rounded-lg overflow-hidden flex text-xs mb-6 font-bold divide-x divide-gray-200 bg-gray-50">
                <div className="flex-1 py-3 px-4 flex justify-between text-gray-800">
                  <span>Gross Earnings</span>
                  <span>₹{grossEarnings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex-1 py-3 px-4 flex justify-between text-gray-800">
                  <span>Total Deductions</span>
                  <span>₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Net Payout Summary (Highlighted box) */}
              <div className="bg-[#0A2342] text-white p-5 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 mb-6 shadow-sm">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-green-400 font-extrabold uppercase tracking-widest">NET PAYOUT (Take-home Salary)</span>
                  <span className="text-2xl font-black mt-1">₹{netSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">Amount in Words</p>
                  <p className="text-xs font-bold text-green-400 mt-1 italic">{numberToWords(netSalary)}</p>
                </div>
              </div>

              {/* Bank Transfer / Cash Payout statement */}
              <p className="text-[10px] text-gray-500 font-medium text-center italic mb-10">
                * This is a computer-generated salary slip and does not require a physical signature. {paymentMode === 'Cash' ? 'The net salary has been disbursed in Cash.' : 'The net salary has been credited to the bank details listed above.'}
              </p>

              {/* Signatures */}
              <div className="mt-auto flex justify-between px-6 pb-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-end">
                    <div className="w-24 h-[0.5px] bg-gray-400"></div>
                  </div>
                  <span className="text-[9px] text-gray-500 font-semibold mt-1">Employee Signature</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 flex items-center justify-center">
                    <img
                      src="/placeholder-signature.jpeg"
                      alt="Signature"
                      className="h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="w-28 h-[0.5px] bg-gray-400"></div>
                  <span className="text-[9px] text-gray-500 font-semibold mt-1">Manager Signature</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
