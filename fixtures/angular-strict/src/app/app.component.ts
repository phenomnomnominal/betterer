import { Component } from '@angular/core';

interface Hero {
  id: number;
  name: string;
}

@Component({
  selector: 'my-app',
  template: `
<div>{{ title }}</div>
<ul>
  <li *ngFor="let hero of heroes; trackBy: trackByHero">
    <div>{{ hero.Id }} {{ hero.name }}</div>
  </li>
</ul>
  `,
})
export class AppComponent {
  public heroes: Array<Hero> = [
    { id: 10, name: "Landon" },
    { id: 20, name: "Ella" },
    { id: 30, name: "Madelyn" },
    { id: 40, name: "Haley" }
  ];
  public trackByHero(hero: Hero) {
    return hero.id;
  }
}