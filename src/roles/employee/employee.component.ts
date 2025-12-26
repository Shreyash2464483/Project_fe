import { Component } from '@angular/core';
import { RouterModule} from "@angular/router";
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-employee',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {

}
