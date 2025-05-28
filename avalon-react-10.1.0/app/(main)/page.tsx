import DashboardContent from './DashboardContent';
import authService from '../../services/authService';

function Dashboard() {
    const userInfo = authService.getUserInfo();
    return <DashboardContent userInfo={userInfo} />;
}

export default Dashboard;