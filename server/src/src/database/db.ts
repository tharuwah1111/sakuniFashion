import fs from 'fs';
import path from 'path';

export interface User {
  User_id: string;
  user_name: string;
  password: string;
  created_at: string;
  is_deleted: number;
}

export interface Design {
  Design_id: string;
  Design_name: string;
  catogory: string;
  price: number;
  fee_for_task: number;
  is_deleted: number;
}

export interface Color {
  Design_id: string;
  color: string;
  is_deleted: number;
}

export interface InventoryItem {
  Inventory_id: string;
  item_name: string;
  qty: number;
  Created_at: string;
  is_deleted: number;
}

export interface Employee {
  Employee_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  NIC: string;
  Created_at: string;
  is_deleted: number;
}

export interface EmployeePhone {
  Employee_id: string;
  number: string;
  state: string;
  is_deleted: number;
}

export interface Customer {
  Customer_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_deleted: number;
  Created_at: string;
}

export interface CustomerPhone {
  Customer_id: string;
  number: string;
  state: string;
  is_deleted: number;
}

export interface CustomerSize {
  Size_id: string;
  Customer_id: string;
  Arm_Length: number;
  Point: number;
  Arm_end: number;
  B_irst: number; // Bust
  Neck_width: number;
  Arm_hole: number;
  Back_height: number;
  Neck_length: number;
  Back_neck_length: number;
  Waist: number;
  Arm: number;
  B_neck_width: number;
  Under_bra: number;
  Side_slim: number;
  Sh_to_under_bra: number;
  Sho_to_point: number;
  F_first: number;
  Shoulder: number;
  sh_to_waist: number;
}

export interface Salary {
  Salary_id: string;
  Employee_id: string;
  date: string;
  salary: number;
}

export interface Order {
  Order_id: string;
  Customer_id: string;
  deadline: string;
  create_at: string;
  time: string;
  is_completed: number; // 0: pending/in-progress, 1: completed, 2: cancelled
  is_deleted: number;
}

export interface OrderItem {
  Order_item_id: string;
  Order_id: string;
  Design_id: string;
  color: string;
  qty: number;
  price: number;
  notes: string;
  is_deleted: number;
}

export interface Task {
  Task_id: string;
  Order_id: string;
  Employee_id: string;
  created_at: string;
  complete_at: string;
  fee: number;
  is_completed: number;
  is_deleted: number;
}

export interface Bill {
  Bill_id: string;
  Order_id: string;
  total: number;
  advance_payment: number;
  remains: number;
  created_at: string;
  is_deleted: number;
}

export interface Appointment {
  Appointment_id: string;
  name: string;
  Appoint_date: string;
  Approved: number;
  is_delete: number;
  number: string;
}

export interface DatabaseSchema {
  Users: User[];
  Designs: Design[];
  Colors: Color[];
  Inventory: InventoryItem[];
  Employees: Employee[];
  Employee_phone: EmployeePhone[];
  Customers: Customer[];
  Customer_phone: CustomerPhone[];
  Customer_size: CustomerSize[];
  Salary: Salary[];
  Orders: Order[];
  Order_items: OrderItem[];
  Task: Task[];
  Bills: Bill[];
  Appointment: Appointment[];
}

const DB_FILE = path.resolve(process.cwd(), 'data', 'sakuni_fashion_db.json');

function getInitialData(): DatabaseSchema {
  const today = '2026-11-01';
  const tomorrow = '2026-11-02';
  const dayAfter = '2026-11-03';
  const nextWeek = '2026-11-07';

  return {
    Users: [
      {
        User_id: 'USR001',
        user_name: 'admin',
        password: 'admin123',
        created_at: '2026-10-01 09:00:00',
        is_deleted: 0,
      },
      {
        User_id: 'USR002',
        user_name: 'sakuni_manager',
        password: 'password123',
        created_at: '2026-10-15 10:30:00',
        is_deleted: 0,
      },
    ],
    Designs: [
      {
        Design_id: 'DSG001',
        Design_name: 'Bridal Saree Jacket',
        catogory: 'Bridal Wear',
        price: 8500,
        fee_for_task: 2500,
        is_deleted: 0,
      },
      {
        Design_id: 'DSG002',
        Design_name: 'Evening Velvet Gown',
        catogory: 'Party Wear',
        price: 14500,
        fee_for_task: 4200,
        is_deleted: 0,
      },
      {
        Design_id: 'DSG003',
        Design_name: 'Linen Office Shirt',
        catogory: 'Formal Wear',
        price: 4200,
        fee_for_task: 1200,
        is_deleted: 0,
      },
      {
        Design_id: 'DSG004',
        Design_name: 'Batik Flare Frock',
        catogory: 'Casual Wear',
        price: 5800,
        fee_for_task: 1600,
        is_deleted: 0,
      },
      {
        Design_id: 'DSG005',
        Design_name: 'Embroidered Kurti',
        catogory: 'Ethnic Wear',
        price: 6500,
        fee_for_task: 1900,
        is_deleted: 0,
      },
    ],
    Colors: [
      { Design_id: 'DSG001', color: 'Gold', is_deleted: 0 },
      { Design_id: 'DSG001', color: 'Maroon', is_deleted: 0 },
      { Design_id: 'DSG001', color: 'Emerald Green', is_deleted: 0 },
      { Design_id: 'DSG002', color: 'Midnight Blue', is_deleted: 0 },
      { Design_id: 'DSG002', color: 'Crimson Red', is_deleted: 0 },
      { Design_id: 'DSG002', color: 'Black Velvet', is_deleted: 0 },
      { Design_id: 'DSG003', color: 'White', is_deleted: 0 },
      { Design_id: 'DSG003', color: 'Sky Blue', is_deleted: 0 },
      { Design_id: 'DSG004', color: 'Sunset Orange', is_deleted: 0 },
      { Design_id: 'DSG004', color: 'Sea Green', is_deleted: 0 },
      { Design_id: 'DSG005', color: 'Peach Pink', is_deleted: 0 },
      { Design_id: 'DSG005', color: 'Royal Purple', is_deleted: 0 },
    ],
    Inventory: [
      {
        Inventory_id: 'INV001',
        item_name: 'Raw Silk Fabric (Meters)',
        qty: 120,
        Created_at: '2026-10-10',
        is_deleted: 0,
      },
      {
        Inventory_id: 'INV002',
        item_name: 'Velvet Fabric Crimson (M)',
        qty: 45,
        Created_at: '2026-10-12',
        is_deleted: 0,
      },
      {
        Inventory_id: 'INV003',
        item_name: 'Cotton Linen Fabric (M)',
        qty: 85,
        Created_at: '2026-10-15',
        is_deleted: 0,
      },
      {
        Inventory_id: 'INV004',
        item_name: 'Gold Zari Thread Spools',
        qty: 32,
        Created_at: '2026-10-18',
        is_deleted: 0,
      },
      {
        Inventory_id: 'INV005',
        item_name: 'Invisible Zippers (Pack 50)',
        qty: 15,
        Created_at: '2026-10-20',
        is_deleted: 0,
      },
      {
        Inventory_id: 'INV006',
        item_name: 'Pearl Beads (Box)',
        qty: 8,
        Created_at: '2026-10-22',
        is_deleted: 0,
      },
    ],
    Employees: [
      {
        Employee_id: 'EMP001',
        first_name: 'Kamal',
        last_name: 'Perera',
        full_name: 'Kamal Perera',
        NIC: '881234567V',
        Created_at: '2026-08-01 08:30:00',
        is_deleted: 0,
      },
      {
        Employee_id: 'EMP002',
        first_name: 'Nadeeka',
        last_name: 'Silva',
        full_name: 'Nadeeka Silva',
        NIC: '926543210V',
        Created_at: '2026-08-15 09:00:00',
        is_deleted: 0,
      },
      {
        Employee_id: 'EMP003',
        first_name: 'Sunil',
        last_name: 'Fernando',
        full_name: 'Sunil Fernando',
        NIC: '849876543V',
        Created_at: '2026-09-01 08:45:00',
        is_deleted: 0,
      },
      {
        Employee_id: 'EMP004',
        first_name: 'Champa',
        last_name: 'Kulatunga',
        full_name: 'Champa Kulatunga',
        NIC: '951239874V',
        Created_at: '2026-09-10 09:15:00',
        is_deleted: 0,
      },
    ],
    Employee_phone: [
      { Employee_id: 'EMP001', number: '0771234567', state: 'Active', is_deleted: 0 },
      { Employee_id: 'EMP001', number: '0112345678', state: 'Home', is_deleted: 0 },
      { Employee_id: 'EMP002', number: '0719876543', state: 'Active', is_deleted: 0 },
      { Employee_id: 'EMP003', number: '0765544332', state: 'Active', is_deleted: 0 },
      { Employee_id: 'EMP004', number: '0751122334', state: 'Active', is_deleted: 0 },
    ],
    Customers: [
      {
        Customer_id: 'CUS001',
        first_name: 'Anoma',
        last_name: 'Jayawardena',
        full_name: 'Anoma Jayawardena',
        is_deleted: 0,
        Created_at: '2026-09-15 11:20:00',
      },
      {
        Customer_id: 'CUS002',
        first_name: 'Dilini',
        last_name: 'Wickramasinghe',
        full_name: 'Dilini Wickramasinghe',
        is_deleted: 0,
        Created_at: '2026-09-20 14:10:00',
      },
      {
        Customer_id: 'CUS003',
        first_name: 'Kasun',
        last_name: 'Bandara',
        full_name: 'Kasun Bandara',
        is_deleted: 0,
        Created_at: '2026-10-02 10:05:00',
      },
      {
        Customer_id: 'CUS004',
        first_name: 'Sanduni',
        last_name: 'Fonseka',
        full_name: 'Sanduni Fonseka',
        is_deleted: 0,
        Created_at: '2026-10-10 16:40:00',
      },
    ],
    Customer_phone: [
      { Customer_id: 'CUS001', number: '0778899001', state: 'Mobile', is_deleted: 0 },
      { Customer_id: 'CUS001', number: '0114455667', state: 'Residence', is_deleted: 0 },
      { Customer_id: 'CUS002', number: '0712233445', state: 'Mobile', is_deleted: 0 },
      { Customer_id: 'CUS003', number: '0767788990', state: 'Mobile', is_deleted: 0 },
      { Customer_id: 'CUS004', number: '0723344556', state: 'Mobile', is_deleted: 0 },
    ],
    Customer_size: [
      {
        Size_id: 'SIZ001',
        Customer_id: 'CUS001',
        Arm_Length: 22.5,
        Point: 9.5,
        Arm_end: 10.0,
        B_irst: 36.0,
        Neck_width: 6.5,
        Arm_hole: 16.0,
        Back_height: 14.5,
        Neck_length: 7.0,
        Back_neck_length: 8.5,
        Waist: 28.5,
        Arm: 12.0,
        B_neck_width: 6.0,
        Under_bra: 31.0,
        Side_slim: 8.0,
        Sh_to_under_bra: 13.0,
        Sho_to_point: 10.0,
        F_first: 14.0,
        Shoulder: 15.0,
        sh_to_waist: 15.5,
      },
      {
        Size_id: 'SIZ002',
        Customer_id: 'CUS002',
        Arm_Length: 21.0,
        Point: 9.0,
        Arm_end: 9.5,
        B_irst: 34.0,
        Neck_width: 6.0,
        Arm_hole: 15.0,
        Back_height: 14.0,
        Neck_length: 6.5,
        Back_neck_length: 8.0,
        Waist: 26.5,
        Arm: 11.0,
        B_neck_width: 5.5,
        Under_bra: 29.5,
        Side_slim: 7.5,
        Sh_to_under_bra: 12.5,
        Sho_to_point: 9.5,
        F_first: 13.5,
        Shoulder: 14.5,
        sh_to_waist: 15.0,
      },
      {
        Size_id: 'SIZ003',
        Customer_id: 'CUS003',
        Arm_Length: 24.0,
        Point: 10.5,
        Arm_end: 11.5,
        B_irst: 40.0,
        Neck_width: 7.5,
        Arm_hole: 18.0,
        Back_height: 16.5,
        Neck_length: 7.5,
        Back_neck_length: 9.0,
        Waist: 34.0,
        Arm: 13.5,
        B_neck_width: 7.0,
        Under_bra: 36.0,
        Side_slim: 9.0,
        Sh_to_under_bra: 14.5,
        Sho_to_point: 11.0,
        F_first: 16.0,
        Shoulder: 17.5,
        sh_to_waist: 17.0,
      },
      {
        Size_id: 'SIZ004',
        Customer_id: 'CUS004',
        Arm_Length: 22.0,
        Point: 9.0,
        Arm_end: 10.5,
        B_irst: 35.0,
        Neck_width: 6.5,
        Arm_hole: 15.5,
        Back_height: 14.0,
        Neck_length: 6.5,
        Back_neck_length: 8.0,
        Waist: 28.0,
        Arm: 11.5,
        B_neck_width: 6.0,
        Under_bra: 30.0,
        Side_slim: 8.0,
        Sh_to_under_bra: 13.0,
        Sho_to_point: 9.5,
        F_first: 14.0,
        Shoulder: 15.0,
        sh_to_waist: 15.0,
      },
    ],
    Salary: [
      {
        Salary_id: 'SAL001',
        Employee_id: 'EMP001',
        date: '2026-10-25',
        salary: 45000,
      },
      {
        Salary_id: 'SAL002',
        Employee_id: 'EMP002',
        date: '2026-10-25',
        salary: 42000,
      },
      {
        Salary_id: 'SAL003',
        Employee_id: 'EMP003',
        date: '2026-10-25',
        salary: 40000,
      },
      {
        Salary_id: 'SAL004',
        Employee_id: 'EMP004',
        date: '2026-10-25',
        salary: 38000,
      },
    ],
    Orders: [
      {
        Order_id: 'ORD001',
        Customer_id: 'CUS001',
        deadline: tomorrow, // IMPORTANT: Due Tomorrow for urgent schedule showcase!
        create_at: '2026-10-24',
        time: '2026-10-24 10:15:00',
        is_completed: 0, // In Progress
        is_deleted: 0,
      },
      {
        Order_id: 'ORD002',
        Customer_id: 'CUS002',
        deadline: dayAfter, // Due in 2 days
        create_at: '2026-10-26',
        time: '2026-10-26 14:00:00',
        is_completed: 0, // In Progress
        is_deleted: 0,
      },
      {
        Order_id: 'ORD003',
        Customer_id: 'CUS003',
        deadline: nextWeek,
        create_at: '2026-10-28',
        time: '2026-10-28 11:30:00',
        is_completed: 0,
        is_deleted: 0,
      },
      {
        Order_id: 'ORD004',
        Customer_id: 'CUS004',
        deadline: '2026-10-30',
        create_at: '2026-10-20',
        time: '2026-10-20 09:45:00',
        is_completed: 1, // Completed
        is_deleted: 0,
      },
    ],
    Order_items: [
      {
        Order_item_id: 'ORI001',
        Order_id: 'ORD001',
        Design_id: 'DSG001',
        color: 'Gold',
        qty: 1,
        price: 8500,
        notes: 'Hand embroidery on back',
        is_deleted: 0,
      },
      {
        Order_item_id: 'ORI002',
        Order_id: 'ORD001',
        Design_id: 'DSG004',
        color: 'Sunset Orange',
        qty: 1,
        price: 5800,
        notes: 'Double border flare',
        is_deleted: 0,
      },
      {
        Order_item_id: 'ORI003',
        Order_id: 'ORD002',
        Design_id: 'DSG002',
        color: 'Midnight Blue',
        qty: 1,
        price: 14500,
        notes: 'Deep back neckline with lining',
        is_deleted: 0,
      },
      {
        Order_item_id: 'ORI004',
        Order_id: 'ORD003',
        Design_id: 'DSG003',
        color: 'White',
        qty: 2,
        price: 4200,
        notes: 'French cuff stitching',
        is_deleted: 0,
      },
      {
        Order_item_id: 'ORI005',
        Order_id: 'ORD004',
        Design_id: 'DSG005',
        color: 'Peach Pink',
        qty: 1,
        price: 6500,
        notes: 'Silk thread mirror work',
        is_deleted: 0,
      },
    ],
    Task: [
      {
        Task_id: 'TSK001',
        Order_id: 'ORD001',
        Employee_id: 'EMP001',
        created_at: '2026-10-24',
        complete_at: tomorrow,
        fee: 2500,
        is_completed: 0,
        is_deleted: 0,
      },
      {
        Task_id: 'TSK002',
        Order_id: 'ORD001',
        Employee_id: 'EMP002',
        created_at: '2026-10-25',
        complete_at: tomorrow,
        fee: 1600,
        is_completed: 0,
        is_deleted: 0,
      },
      {
        Task_id: 'TSK003',
        Order_id: 'ORD002',
        Employee_id: 'EMP002',
        created_at: '2026-10-26',
        complete_at: dayAfter,
        fee: 4200,
        is_completed: 0,
        is_deleted: 0,
      },
      {
        Task_id: 'TSK004',
        Order_id: 'ORD003',
        Employee_id: 'EMP003',
        created_at: '2026-10-28',
        complete_at: nextWeek,
        fee: 2400,
        is_completed: 0,
        is_deleted: 0,
      },
      {
        Task_id: 'TSK005',
        Order_id: 'ORD004',
        Employee_id: 'EMP004',
        created_at: '2026-10-20',
        complete_at: '2026-10-29',
        fee: 1900,
        is_completed: 1,
        is_deleted: 0,
      },
    ],
    Bills: [
      {
        Bill_id: 'BIL001',
        Order_id: 'ORD001',
        total: 14300,
        advance_payment: 8000,
        remains: 6300,
        created_at: '2026-10-24 10:30:00',
        is_deleted: 0,
      },
      {
        Bill_id: 'BIL002',
        Order_id: 'ORD002',
        total: 14500,
        advance_payment: 5000,
        remains: 9500,
        created_at: '2026-10-26 14:15:00',
        is_deleted: 0,
      },
      {
        Bill_id: 'BIL003',
        Order_id: 'ORD003',
        total: 8400,
        advance_payment: 3000,
        remains: 5400,
        created_at: '2026-10-28 11:45:00',
        is_deleted: 0,
      },
      {
        Bill_id: 'BIL004',
        Order_id: 'ORD004',
        total: 6500,
        advance_payment: 6500,
        remains: 0,
        created_at: '2026-10-20 10:00:00',
        is_deleted: 0,
      },
    ],
    Appointment: [
      {
        Appointment_id: 'APT001',
        name: 'Ruvini Samarawickrama',
        Appoint_date: today,
        Approved: 1,
        is_delete: 0,
        number: '0775566778',
      },
      {
        Appointment_id: 'APT002',
        name: 'Hansi Alahakoon',
        Appoint_date: tomorrow,
        Approved: 1,
        is_delete: 0,
        number: '0714455889',
      },
      {
        Appointment_id: 'APT003',
        name: 'Niluka Pieris',
        Appoint_date: dayAfter,
        Approved: 0,
        is_delete: 0,
        number: '0763322114',
      },
      {
        Appointment_id: 'APT004',
        name: 'Kaushalya Dissanayake',
        Appoint_date: nextWeek,
        Approved: 0,
        is_delete: 0,
        number: '0789988776',
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading db file, re-initializing database:', e);
    }
    const initial = getInitialData();
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving db file:', e);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public resetToDefault() {
    this.data = getInitialData();
    this.save();
    return this.data;
  }
}

export const db = new Database();
