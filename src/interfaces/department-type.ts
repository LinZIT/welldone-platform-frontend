export interface IDepartment {
    id: number;
    description: DepartmentDescriptionType;
    created_at: string;
    updated_at: string;
}
export type DepartmentDescriptionType = 'IT' | 'Customer Service' | 'Human Resources' | 'Income' | 'Operations' | 'Sales' | 'Marketing' | 'Disbursements' | 'Finance' | 'Claims' | 'Analysis';
export type DepartmentType = 'it' | 'cs' | 'hr' | 'income' | 'operations' | 'sales' | 'marketing' | 'disbursements' | 'finance' | 'claims' | 'analysis';