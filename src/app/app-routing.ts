import { StockDetailsComponent } from './stock-details/stock-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { Routes, RouterModule } from '@angular/router'
import { WatchlistComponent } from './watchlist/watchlist.component';
const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'stock/:sname', component: StockDetailsComponent},
    { path: 'mylist', component: WatchlistComponent},
    { path: '**', component: NotFoundComponent }
];

export const routing = RouterModule.forRoot(appRoutes);