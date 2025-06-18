export interface Student {
    id: number;
    name: string;
    image: string;
    competence: string;
    date: string;
    status: 'Present' | 'Absent' | 'Retard';
  }
  
  export interface ClassData {
    name: string;
    totalStudents: number;
    present: number;
    late: number;
    absent: number;
    teacherName: string;
    maleCount: number;
    femaleCount: number;
    series: string;
  }
  
  export interface Event {
    title: string;
    time: string;
  }
  
  export interface FilterState {
    trimester: string;
    type: string;
    status: string;
  }
  
  export interface FilterOptions {
    trimester: string[];
    type: string[];
    status: string[];
  } 