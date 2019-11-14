import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { PlanDetails } from 'src/app/providers/model/planDetails';
import { ViewPlanProofComponent } from '../associate-plan/view-plan-proof/view-plan-proof.component';

@Component({
  selector: 'app-view-current-user-plan-detail',
  templateUrl: './view-current-user-plan-detail.component.html',
  styleUrls: ['./view-current-user-plan-detail.component.scss']
})
export class ViewCurrentUserPlanDetailComponent implements OnInit {
  associatePlans: any;

  constructor(public dialogRef: MatDialogRef<ViewCurrentUserPlanDetailComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog) {
    this.associatePlans = data.associatePlans;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  viewFile(associateplan: PlanDetails): void {
    const dialogRef = this.dialog.open(ViewPlanProofComponent, {
      maxHeight: "710px",
      disableClose: true,
      data: { associateplan: associateplan }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
      }
    });
  }


}
