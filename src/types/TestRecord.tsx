interface TestRecord {
  id: number;
  patientName: string;
  testType: string;
  result: string;
  testDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default TestRecord;
