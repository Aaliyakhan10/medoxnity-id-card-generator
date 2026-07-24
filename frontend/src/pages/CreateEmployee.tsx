import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import { IdCardPreview } from '../components/IdCardPreview';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { Loader2, Printer, Download, Save } from 'lucide-react';

const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  dateOfJoining: z.string().min(1, 'Date of Joining is required'),
  bloodGroup: z.string().optional(),
  phone: z.string().min(10, 'Valid phone is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(1, 'Address is required'),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function CreateEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
  });

  const formValues = watch();

  useEffect(() => {
    if (id) {
      const fetchEmployee = async () => {
        setIsLoading(true);
        try {
          const res = await api.get(`/employees/${id}`);
          const emp = res.data;
          
          // format date for input
          const formattedDate = emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '';
          
          reset({
            ...emp,
            dateOfJoining: formattedDate
          });
          if (emp.photoUrl) setPhotoUrl(emp.photoUrl);
        } catch (error) {
          console.error(error);
          alert('Failed to load employee details');
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployee();
    }
  }, [id, reset]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a local object url for immediate preview
    setPhotoUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      setIsSubmitting(true);
      let uploadedPhotoUrl = photoUrl;

      const file = fileInputRef.current?.files?.[0];
      if (file) {
        const formData = new FormData();
        formData.append('photo', file);
        const uploadRes = await api.post('/employees/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedPhotoUrl = uploadRes.data.photoUrl;
      }

      if (id) {
        await api.put(`/employees/${id}`, {
          ...data,
          photoUrl: uploadedPhotoUrl,
        });
        alert('Employee updated successfully!');
        navigate('/history');
      } else {
        await api.post('/employees', {
          ...data,
          photoUrl: uploadedPhotoUrl,
        });
        alert('Employee created successfully!');
        reset();
        setPhotoUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
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
      pdf.save(`${formValues.employeeId || 'employee'}-id-card.pdf`);
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
      link.download = `${formValues.employeeId || 'employee'}-id-card.png`;
      link.click();
    } catch (err: any) {
      console.error(err);
      alert(`Failed to generate Image: ${err.message || String(err)}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Form Section */}
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{id ? 'Edit Employee' : 'Create New Employee'}</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input {...register('employeeId')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input {...register('name')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Designation</label>
                <input {...register('designation')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input {...register('department')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                <input type="date" {...register('dateOfJoining')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select {...register('bloodGroup')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white">
                  <option value="">Select...</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
                {errors.bloodGroup && <p className="text-red-500 text-xs mt-1">{errors.bloodGroup.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input {...register('phone')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea {...register('address')} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Photo</label>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-4">
              <button type="submit" disabled={isSubmitting} className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                {id ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </form>
          )}
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-gray-100 p-6 rounded-xl flex flex-col items-center border border-gray-200">
           <div className="w-full flex justify-between items-center mb-4">
             <h2 className="text-lg font-bold text-gray-700">Live Preview</h2>
             <div className="flex gap-2">
               <button type="button" onClick={handlePrint} className="flex items-center gap-2 p-2 px-3 bg-white rounded-md shadow-sm text-gray-600 hover:text-blue-600 text-sm font-medium" title="Print">
                 <Printer className="w-4 h-4" /> Print
               </button>
               <button type="button" onClick={handleDownloadPDF} className="flex items-center gap-2 p-2 px-3 bg-white rounded-md shadow-sm text-gray-600 hover:text-green-600 text-sm font-medium" title="Download PDF">
                 <Download className="w-4 h-4" /> PDF
               </button>
               <button type="button" onClick={handleDownloadImage} className="flex items-center gap-2 p-2 px-3 bg-white rounded-md shadow-sm text-gray-600 hover:text-purple-600 text-sm font-medium" title="Download Image">
                 <Download className="w-4 h-4" /> PNG
               </button>
             </div>
           </div>
           
           <div className="w-full overflow-auto flex justify-center pb-8">
             <IdCardPreview data={{ ...formValues, photoUrl }} forwardedRef={cardRef} />
           </div>
        </div>

      </div>
    </div>
  );
}
