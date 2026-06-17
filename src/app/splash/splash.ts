import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../../services/api';
import { Users } from '../../services/users.service';

@Component({
  selector: 'app-splash',
  imports: [CommonModule],
  templateUrl: './splash.html',
  styleUrl: './splash.scss',
})
export class Splash {
  padding_login = signal<boolean>(false);
  error_login = signal<boolean>(false);
  is_login = signal<boolean>(true);
  pass_strong_lvl: number;
  pass_text_mode = signal<boolean>(false);
  pass_text_mode_login = signal<boolean>(false);
  userRemember = signal<boolean>(false);
  userAgree = signal<boolean>(true);
  create_info = signal<any>({
    fristname: '',
    lastname: '',
    email: '',
    pass: '',
  });
  error_create_info = signal<any>({
    fristname: '',
    lastname: '',
    email: '',
    pass: '',
  });

  login_info = signal<any>({
    email: '',
    pass: '',
  });

  ngOnInit() {
    this.api.checkAuth().subscribe(
      (res: any) => {
        if (res.user) {
          this.user.addUserData(res?.user);
          this.router.navigate(['/dashboard']);
        }
      },
      (err: any) => {},
    );
    // this.api.userLogout();
  }
  updateCreateInfo(data: any) {
    this.create_info.update((current) => ({
      ...current,
      ...data,
    }));
  }

  createTextInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;

    if (!input || !input.name) return;

    this.updateCreateInfo({
      [input.name]: input.value,
    });
  }

  constructor(
    private api: Api,
    private user: Users,
    private router: Router,
  ) {
    this.pass_strong_lvl = 0;
  }
  onChangeLoginStatus(): void {
    this.is_login.set(!this.is_login());
  }
  onChangePassTextMode(): void {
    this.pass_text_mode.set(!this.pass_text_mode());
  }

  onChangePassTextModeLogin(): void {
    this.pass_text_mode_login.set(!this.pass_text_mode_login());
  }
  onChangeloginErrorStatus(result: boolean): void {
    this.error_login.set(result);
  }
  onChangeUserRem(): void {
    this.userRemember.set(!this.userRemember());
  }
  onChangeUserAgree(): void {
    this.userAgree.set(!this.userAgree());
  }
  onPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.pass_strong_lvl = this.verifyPassword(value);
    this.create_info.update((current) => ({
      ...current,
      pass: value,
    }));
  }

  submitToCreate(): void {
    this.error_create_info.set({
      fristname: '',
      lastname: '',
      email: '',
      pass: '',
    });
    if (this.userAgree()) {
      this.api
        .userCreate({
          ...this.create_info(),
          agree: this.userAgree(),
        })
        .subscribe(
          (e: any) => {
            if (e.success) {
              this.is_login.set(true);
              this.create_info.set({
                fristname: '',
                lastname: '',
                email: '',
                pass: '',
              });
              this.userAgree.set(false);
              this.error_create_info.set({
                fristname: '',
                lastname: '',
                email: '',
                pass: '',
              });
              this.pass_strong_lvl = 0;
            }
          },
          (err: any) => {
            if (err?.error) {
              const items: any = {
                fristname: '',
                lastname: '',
                email: '',
                pass: '',
              };
              const create_data: any = {
                ...this.create_info(),
              };
              for (const element of err?.error?.errors) {
                items[Object.keys(element)[0]] = element[Object.keys(element)[0]];
                create_data[Object.keys(element)[0]] = '';
              }
              this.create_info.set(create_data);
              this.error_create_info.set(items);
            }
          },
        );
    }
  }
  verifyPassword(password: any) {
    let score = 0;

    if (!password || password.length === 0) return 0;

    if (password.length >= 8) score++;

    if (/[A-Z]/.test(password)) score++;

    if (/[0-9]/.test(password)) score++;

    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }

  onLoginSubmit(): void {
    if (!this.padding_login()) {
      
    this.onChangeloginErrorStatus(false);

    this.padding_login.set(true);
    this.api
      .userLogin({
        ...this.login_info(),
        rem: this.userRemember(),
      })
      .subscribe(
        (e) => {

          
          this.router.navigate(['/']);

          this.padding_login.set(false);
        },
        (err: any) => {
          this.onChangeloginErrorStatus(true);

          this.padding_login.set(false);
        },
      );
    }



    
  }

  loginPasswordInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.login_info.update((current) => ({
      ...current,
      pass: value,
    }));
  }

  loginEmailInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.login_info.update((current) => ({
      ...current,
      email: value,
    }));
  }
}
