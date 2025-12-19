import { Routes } from "@angular/router";
import { ManagerComponent } from "./manager.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DecisionComponent } from "./decision/decision.component";

export const mangerroutes: Routes=[{
    path:'',
    component:ManagerComponent,
    children:[
        {path:'dashboard',component:DashboardComponent},
        {path:'decision',component:DecisionComponent},
        {path:'manager',redirectTo:'dashboard',pathMatch:'full'}
    ]
}]