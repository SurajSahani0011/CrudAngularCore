import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../../Services/employee.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],//common module name k input ko uppercase karne k liye use hota hai
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {

  @ViewChild('myModel') model : ElementRef | undefined;
  employeeList : Employee[] = [];
  empService = inject(EmployeeService);

  employeeForm : FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder){}
  ngOnInit(): void {
      this.setFormState();
      this.getEmployees();
  }

  

  openModel()
  {
    const empModel = document.getElementById('myModal');
    if(empModel != null)
    {
        empModel.style.display = 'block';
    }
  }

  closeModel()
  {
    this.setFormState(); //jab form pe condition laga ho tab save,update ko fix karne k liye
     if(this.model != null)
     {
         this.model.nativeElement.style.display = 'none';
     }
  }
  getEmployees()
  {
    this.empService.getAllEmloyees().subscribe((res) =>{
      this.employeeList = res;
    })
  }
  setFormState()
   {
    this.employeeForm = this.fb.group({
       
      id: [0],
      name: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      mobile: ['', [Validators.required]],
      age: [null, [Validators.required]],
      salary: [null,[Validators.required]],
      status:[false]

    });
   }
   formValues:any;
   OnSubmit() {
    console.log('Form Data:', this.employeeForm.value);
    if (this.employeeForm.invalid) {
      alert('Please fill all fields');
      return;
    }
    if(this.employeeForm.value.id == 0)
    {
      this.formValues = this.employeeForm.value;
      this.empService.addEmployee(this.formValues).subscribe({
        next: (res) => {
          alert('Employee Added Successfully');
          this.getEmployees(); // Assuming this method refreshes the employee list.
          this.employeeForm.reset();
          this.closeModel(); // Assuming this closes the modal.
        },
        error: (err) => {
          console.error('Error while adding employee:', err);
          alert('Failed to add employee');
        }
      });
    }else{
      this.formValues = this.employeeForm.value;
      this.empService.updateEmployee(this.formValues).subscribe({
        next: (res) => {
          alert('Employee Updated Successfully');
          this.getEmployees(); // Assuming this method refreshes the employee list.
          this.employeeForm.reset();
          this.closeModel(); // Assuming this closes the modal.
        },
        error: (err) => {
          console.error('Error while adding employee:', err);
          alert('Failed to add employee');
        }
      });
    }
   
  }

  OnEdit(Employee : Employee)
  {
    this.openModel();
    this.employeeForm.patchValue(Employee);
  }

  // OnDelete(id: number) id se delete
  OnDelete(employee: Employee)
  {
    const isConfirm = confirm("Are you sure want to delete this Employee" + employee.name);
    if (isConfirm)
    {
      this.empService.deleteEmployee(employee.id).subscribe((res) => {
        alert("Employee Deleted Seccessfully"); 
          this.getEmployees(); 
    });

    }
   
  }
}
