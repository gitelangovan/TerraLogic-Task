import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainForm } from '../models/main-form';
import { MockServiceService } from '../services/mock-service.service';

@Component({
  selector: 'app-main-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.scss'
})
export class MainFormComponent implements OnInit {

  applicantForm!: FormGroup;
  submitted: boolean = false;
  appFromarray!: FormArray;
  mainModel = new MainForm();

  // Post Call
  succesMsg: boolean = false;
  succesMsgValue: string = "";
  fetchFunction: boolean = false;

  // Fetch Call
  getData: any = [];
  fetchOneErrorGet: string = "";
  errorGet: string = "";
  fetchDataArr: any = [];
  contact: any;

  isFrontEndChecked = [false];
  isBackEndChecked = [false];
  isFullStackChecked = [false];
  fetchError: boolean = false;

  constructor(private formBuilder: FormBuilder, private mockService: MockServiceService) { }

  ngOnInit(): void {
    if (this.getData == "") {
      this.applicantForm = this.formBuilder.group({
        appFromarray: this.formBuilder.array([this.applicantDetails('')])
      });
    }
  }

  applicantDetails(data: any) {
    return this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      contact: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
      domain: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      messageHr: new FormControl('', Validators.required),
      status: new FormControl('A'),
    });
  }

  applicationDetails1(data: any, index: any): FormGroup {
    this.checkBox1(data.domain, index);
    return this.formBuilder.group({
      firstName: new FormControl({ disabled: false, value: data.firstName }, Validators.required),
      applicantId: new FormControl({ disabled: false, value: data.id }),
      lastName: new FormControl({ disabled: false, value: data.lastName }, Validators.required),
      email: new FormControl({ disabled: false, value: data.email }, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      contact: new FormControl({ disabled: false, value: data.contact }, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
      domain: new FormControl({ disabled: false, value: data.domain, }, Validators.required),
      gender: new FormControl({ disabled: false, value: data.gender }, Validators.required),
      messageHr: new FormControl({ disabled: false, value: data.messageHr }, Validators.required),
      status: new FormControl({ disabled: false, value: data.status }),
    });
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Select only perticular value
  checkBox(event: any, selectedDomain: string, index: any): void {
    // Getting all checkboxes
    const frontEndCheckbox = document.getElementById('frontEnd') as HTMLInputElement;
    const backEndCheckbox = document.getElementById('backEnd') as HTMLInputElement;
    const fullStackCheckbox = document.getElementById('fullStack') as HTMLInputElement;

    const array = this.applicantForm.get('appFromarray') as FormArray;
    const formData = array.at(0);

    // If the current checkbox is checked, uncheck the others
    if (event.target.checked) {
      if (selectedDomain === 'frontEnd') {
        backEndCheckbox.checked = false;
        fullStackCheckbox.checked = false;
        formData.get('domain')?.setValue('frontEnd');
      } else if (selectedDomain === 'backEnd') {
        frontEndCheckbox.checked = false;
        fullStackCheckbox.checked = false;
        formData.get('domain')?.setValue('backEnd');
      } else if (selectedDomain === 'fullStack') {
        frontEndCheckbox.checked = false;
        backEndCheckbox.checked = false;
        formData.get('domain')?.setValue('fullStack');
      }
    }
    else {
      selectedDomain = "";
    }

    this.checkBox1(selectedDomain, index);
  }

  checkBox1(selectedDomain: any, index: any) {
    // Getting all checkboxes
    if (selectedDomain === 'frontEnd') {
      this.isFrontEndChecked[index] = true;
      this.isBackEndChecked[index] = false;
      this.isFullStackChecked[index] = false;
    }
    else if (selectedDomain === 'backEnd') {
      this.isFrontEndChecked[index] = false;
      this.isBackEndChecked[index] = true;
      this.isFullStackChecked[index] = false;
    }
    else if (selectedDomain === 'fullStack') {
      this.isFrontEndChecked[index] = false;
      this.isBackEndChecked[index] = false;
      this.isFullStackChecked[index] = true;
    }
    else {
      this.isFrontEndChecked[index] = false;
      this.isBackEndChecked[index] = false;
      this.isFullStackChecked[index] = false;
    }
  }

  overAllControl(): any {
    return (<FormArray>this.applicantForm.get('appFromarray')).controls;
  }

  itrApplicant(item: any) {
    this.fetchDataArr = [];
    var i = 0;
    for (let value of item) {
      this.fetchDataArr.push(this.applicationDetails1(value, i));
      i++;
    }
    this.applicantForm.setControl('appFromarray', this.formBuilder.array(this.fetchDataArr || []));
  }

  fetchData() {
    this.errorGet = "";
    this.getData = [];
    this.mockService.getData().subscribe({
      next: (value) => {
        this.getData = value;
        this.itrApplicant(this.getData);
      },
      error: (err) => this.errorGet = err,
      complete: () => "Data Successfully Fetched"
    });
  }

  fetchOneData(id: any) {
    this.fetchOneErrorGet = "";
    this.getData = [];
    this.mockService.geOneData(id.value).subscribe({
      next: (value) => {
        this.getData = [value];
        this.itrApplicant(this.getData);
      },
      error: (err) => {
        this.fetchError = true;
        this.fetchOneErrorGet = "Something went wrong, Please check with Different ID";
        setTimeout(() => {
          this.fetchError = false;
          this.fetchOneErrorGet = "";
        }, 3000);
      },
      complete: () => "Data Successfully Fetched"
    });
  }

  submitData() {
    this.submitted = true;
    if (this.applicantForm.invalid) {
      return;
    }
    else {
      var jsonData;
      var errorData = [];
      this.mockService.addData(this.getApplicantData()).subscribe({
        next: (value) => {
          jsonData = value;
          setTimeout(() => {
            this.succesMsg = false;
            this.succesMsgValue = "";
          }, 3000);

          this.resetForm();
          this.fetchFunction = true;
        },
        error: (error) => errorData = error,
        complete: () => {
          this.fetchFunction = true;
          this.succesMsgValue = "Data successfully Added into DataBase";
          this.succesMsg = true
        }
      });

      this.resetForm();
      this.fetchFunction = true;
    }
  }

  getApplicantData() {
    
    this.mainModel.firstName = this.applicantForm.value.appFromarray[0].firstName;
    this.mainModel.lastName = this.applicantForm.value.appFromarray[0].lastName;
    this.mainModel.email = this.applicantForm.value.appFromarray[0].email;
    this.mainModel.contact = this.applicantForm.value.appFromarray[0].contact;
    this.mainModel.domain = this.applicantForm.value.appFromarray[0].domain;
    this.mainModel.gender = this.applicantForm.value.appFromarray[0].gender;
    this.mainModel.messageHr = this.applicantForm.value.appFromarray[0].messageHr;
    this.mainModel.status = this.applicantForm.value.appFromarray[0].status;

    return this.mainModel;
  }

  resetForm() {
    this.submitted = false;
    let array = this.applicantForm.get('appFromarray') as FormArray;
    for (let i = array.length; i >= 1; i--) {
      array.removeAt(i);
    }
    this.applicantForm.reset();
    this.isFrontEndChecked = [false];
    this.isBackEndChecked = [false];
    this.isFullStackChecked = [false];
  }
}
