const API_BASE = '/api';

async function fetchJson(url, options) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errMsg = `Request failed with status ${res.status}`;
    try {
      const errObj = await res.json();
      if (errObj.error) errMsg = errObj.error;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Users
  login: async (credentials) => {
    return fetchJson('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  getUsers: async () => fetchJson('/login/users'),
  createUser: async (user) => {
    return fetchJson('/login/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  // Customers
  getCustomers: async (q = '') => fetchJson(`/customers?q=${encodeURIComponent(q)}`),
  getCustomer: async (id) => fetchJson(`/customers/${id}`),
  createCustomer: async (customer) =>
    fetchJson('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    }),
  updateCustomer: async (id, customer) =>
    fetchJson(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    }),
  deleteCustomer: async (id) =>
    fetchJson(`/customers/${id}`, {
      method: 'DELETE',
    }),

  // Designs
  getDesigns: async () => fetchJson('/designs'),
  createDesign: async (design) =>
    fetchJson('/designs', {
      method: 'POST',
      body: JSON.stringify(design),
    }),
  updateDesign: async (id, design) =>
    fetchJson(`/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(design),
    }),
  deleteDesign: async (id) =>
    fetchJson(`/designs/${id}`, {
      method: 'DELETE',
    }),

  // Inventory
  getInventory: async () => fetchJson('/inventory'),
  createInventoryItem: async (item) =>
    fetchJson('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateInventoryItem: async (id, item) =>
    fetchJson(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  adjustInventoryStock: async (id, change) =>
    fetchJson(`/inventory/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ change }),
    }),
  deleteInventoryItem: async (id) =>
    fetchJson(`/inventory/${id}`, {
      method: 'DELETE',
    }),

  // Employees
  getEmployees: async (q = '') => fetchJson(`/employees?q=${encodeURIComponent(q)}`),
  getEmployee: async (id) => fetchJson(`/employees/${id}`),
  createEmployee: async (emp) =>
    fetchJson('/employees', {
      method: 'POST',
      body: JSON.stringify(emp),
    }),
  updateEmployee: async (id, emp) =>
    fetchJson(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(emp),
    }),
  deleteEmployee: async (id) =>
    fetchJson(`/employees/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status !== undefined) params.append('status', String(filters.status));
    if (filters.customer_id) params.append('customer_id', filters.customer_id);
    if (filters.urgent) params.append('urgent', 'true');
    return fetchJson(`/orders?${params.toString()}`);
  },
  getOrder: async (id) => fetchJson(`/orders/${id}`),
  createOrder: async (order) =>
    fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  updateOrder: async (id, order) =>
    fetchJson(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    }),
  updateOrderStatus: async (id, status) =>
    fetchJson(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteOrder: async (id) =>
    fetchJson(`/orders/${id}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.employee_id) params.append('employee_id', filters.employee_id);
    if (filters.is_completed !== undefined) params.append('is_completed', String(filters.is_completed));
    if (filters.order_id) params.append('order_id', filters.order_id);
    return fetchJson(`/tasks?${params.toString()}`);
  },
  createTask: async (task) =>
    fetchJson('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  updateTask: async (id, task) =>
    fetchJson(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),
  completeTask: async (id, is_completed) =>
    fetchJson(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed }),
    }),
  deleteTask: async (id) =>
    fetchJson(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Bills
  getBills: async () => fetchJson('/bills'),
  getBill: async (id) => fetchJson(`/bills/${id}`),
  createBill: async (bill) =>
    fetchJson('/bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    }),
  recordBillPayment: async (id, payment_amount) =>
    fetchJson(`/bills/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ payment_amount }),
    }),
  deleteBill: async (id) =>
    fetchJson(`/bills/${id}`, {
      method: 'DELETE',
    }),

  // Salary
  getSalaries: async (employee_id) => {
    const url = employee_id ? `/salary?employee_id=${employee_id}` : '/salary';
    return fetchJson(url);
  },
  paySalary: async (data) =>
    fetchJson('/salary', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Appointments
  getAppointments: async (approved) => {
    const url = approved !== undefined ? `/appointment?approved=${approved}` : '/appointment';
    return fetchJson(url);
  },
  createAppointment: async (apt) =>
    fetchJson('/appointment', {
      method: 'POST',
      body: JSON.stringify(apt),
    }),
  approveAppointment: async (id, Approved) =>
    fetchJson(`/appointment/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ Approved }),
    }),
  updateAppointment: async (id, apt) =>
    fetchJson(`/appointment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(apt),
    }),
  deleteAppointment: async (id) =>
    fetchJson(`/appointment/${id}`, {
      method: 'DELETE',
    }),

  // Schedules (Upcoming orders, spotlight on tomorrow's deadlines)
  getSchedules: async () => fetchJson('/shedules'),
  getTomorrowOrders: async () => fetchJson('/shedules/tomorrow'),

  // Performance
  getPerformance: async () => fetchJson('/performance'),

  // Reset database
  resetDatabase: async () => fetchJson('/database/reset', { method: 'POST' }),
};
