import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToasterService } from 'angular2-toaster';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { UserGroupNewService } from 'src/app/providers/service/onboarding/group-course/userGroup.service';
import { ISummaryPlanDetails } from 'src/app/providers/model/summary-plan-details';
import { PageChangedEvent } from 'ngx-bootstrap';
import { AssociatePlanService } from 'src/app/providers/service/onboarding/associatePlan.service';
import { PlanDetails } from 'src/app/providers/model/planDetails';
import { ViewCurrentUserPlanDetailComponent} from '../view-current-user-plan-detail/view-current-user-plan-detail.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
})
export class PlanSummaryComponent implements OnInit {
    courseForm: FormGroup;
    submitted = false;
    summaryPlanDetails: ISummaryPlanDetails[] = [];
    currentPage: number = 0;
    totalItems: number;
    associatePlans: PlanDetails[];

    constructor(
        private formBuilder: FormBuilder,
        private userGroupService: UserGroupNewService,
        private spinnerService: Ng4LoadingSpinnerService,
        private associatePlanService: AssociatePlanService,
        public dialog: MatDialog
        ) { }

    ngOnInit() {
        this.createForm();
        this.getPlanSummaryDetail();
    }

    pageChanged(event: PageChangedEvent): void {
        this.currentPage = event.page;
        this.getPlanSummaryDetail();
    }

    clearData() {
        this.courseForm.setValue({
            associateId: ""
        });
        this.getPlanSummaryDetail();
    }

    createForm() {
        this.courseForm = this.formBuilder.group({
            associateId: ['', Validators.required],
        });
    }

    private getPlanSummaryDetail() {
        this.spinnerService.show();
        const startItem = this.currentPage * 10;
        this.userGroupService.getPlanSummaryDetail(null, startItem).subscribe(response => {
            this.spinnerService.hide();
            this.summaryPlanDetails = response.summaryDetails;
            this.totalItems = response.count;
        });
    }

    get f() { return this.courseForm.controls; }

    getPlanSummaryDetailByAssociateId() {
        this.submitted = true;
        if (this.courseForm.invalid) {
            return;
        }
        const associateId = this.courseForm.get('associateId').value;
        this.spinnerService.show();
        this.userGroupService.getPlanSummaryDetail(associateId, 0).subscribe(response => {
            this.spinnerService.hide();
            this.summaryPlanDetails = response.summaryDetails;
            this.totalItems = response.count;
        });
    }

     getPlanDetailsForCurrentUser(associateID: string) {
        this.spinnerService.show();
        this.associatePlanService.getUserInfo().subscribe((response: any) => {
            const object = response.UserProfileProperties
                .reduce((obj, item) => Object.assign(obj, { [item.Key]: item.Value }), {});
            this.associatePlanService.getSummary(associateID).subscribe(model => {
                if (model && model.value && model.value.length > 0) {
                    this.spinnerService.hide();
                    this.associatePlans = model.value;
                    this.sortBy('Day', this.associatePlans);
                }
            });
        }, error => {
            this.spinnerService.hide();
            console.log(error);
        });
        const dialogRef = this.dialog.open(ViewCurrentUserPlanDetailComponent, {
            disableClose: true,
            data: { associatePlans:this.associatePlans }
          });
    }

    private sortBy(field: string, associatePlans: any) {

        associatePlans.sort((a: any, b: any) => {
            if (+a[field] < +b[field]) {
                return -1;
            } else if (+a[field] > +b[field]) {
                return 1;
            } else {
                return 0;
            }
        });
        this.associatePlans = associatePlans;
    }
}