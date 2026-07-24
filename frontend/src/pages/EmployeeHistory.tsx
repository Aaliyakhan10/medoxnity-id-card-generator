import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { Search, Edit, Trash2, Printer, Download, Eye } from 'lucide-react';
import { IdCardPreview } from '../components/IdCardPreview';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export default function EmployeeHistory() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
         console.error(error);
         alert('Failed to delete');
      }
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
  });

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    try {
      const width = cardRef.current.offsetWidth * 2;
      const height = cardRef.current.offsetHeight * 2;
      const imgData = await toPng(cardRef.current, { pixelRatio: 2 });
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [width, height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${selectedEmployee?.employeeId || 'employee'}-id-card.pdf`);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to generate PDF: ${err.message || String(err)}`);
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const imgData = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${selectedEmployee?.employeeId || 'employee'}-id-card.png`;
      link.click();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to generate Image: ${err.message || String(err)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Employee History</h1>
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID & Dept</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Joined</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {emp.photoUrl ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={emp.photoUrl} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                              {emp.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-500">{emp.designation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.employeeId}</div>
                      <div className="text-sm text-gray-500">{emp.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{emp.phone}</div>
                      <div className="text-sm text-gray-500">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(emp.dateOfJoining), 'dd MMM yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setSelectedEmployee(emp)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-md" title="View Card">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => navigate(`/edit/${emp.id}`)} className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-md" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for ID Card Preview */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-3xl w-full flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">ID Card - {selectedEmployee.name}</h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  <Download className="w-4 h-4" /> PDF
                </button>
                <button onClick={handleDownloadImage} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                  <Download className="w-4 h-4" /> PNG
                </button>
                <button onClick={() => setSelectedEmployee(null)} className="ml-4 text-gray-500 hover:text-gray-700 font-bold text-xl px-2">
                  &times;
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex justify-center bg-gray-200">
               <div className="scale-90 sm:scale-100 transform origin-top">
                 <IdCardPreview data={selectedEmployee} forwardedRef={cardRef} />
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
