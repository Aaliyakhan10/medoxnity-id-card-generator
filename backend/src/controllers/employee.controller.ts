import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { supabase } from '../config/supabase';
import { z } from 'zod';

const employeeSchema = z.object({
  employeeId: z.string().min(1),
  name: z.string().min(1),
  designation: z.string().min(1),
  department: z.string().min(1),
  dateOfJoining: z.string().transform((str) => new Date(str)),
  bloodGroup: z.string().optional().default(''),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  photoUrl: z.string().optional(),
});

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({ data });
    res.status(201).json(employee);
  } catch (error: any) {
    console.error("Error creating employee:", error);
    res.status(400).json({ error: error.message || String(error) });
  }
};

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const employees = await prisma.employee.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: String(search), mode: 'insensitive' } },
              { employeeId: { contains: String(search), mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
    res.json(employees);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const data = employeeSchema.partial().parse(req.body);
    const employee = await prisma.employee.update({
      where: { id },
      data,
    });
    res.json(employee);
  } catch (error: any) {
    console.error("Error updating employee:", error);
    res.status(400).json({ error: error.message || String(error) });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.employee.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    // Read the file as buffer and upload to Supabase Storage
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from('employee-photos')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('employee-photos')
      .getPublicUrl(fileName);

    res.json({ photoUrl: publicUrlData.publicUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
