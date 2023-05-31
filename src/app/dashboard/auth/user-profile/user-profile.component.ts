import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UserService } from '../../services/user.service';

import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user!: User;

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.user = res.content as User;
      },
    });
  }

  ngOnInit(): void {}

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: this.user,
    });
  }
}
