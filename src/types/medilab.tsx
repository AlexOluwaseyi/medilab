export interface Appointment {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  appointmentDate: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "COMPLETED" | "CANCELLED";
  test: string;
  doctorId?: string;
  TestResult?: Array<{
    id: string;
    result: string;
    appointmentId: string;
    doctorId: string;
  }>;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
}
