import Button from "../../../components/Buttons/Button";

const SessionsData = [{
    name: 'Gamification in Education: Making Learning Fun and Effective',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/google-certified-educators-homepage.jpg'
},
{
    name: 'Innovative Math Teaching: Incorporating STEP and Robotics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/microsft-certified-educators-homepage1.jpg'
},
{
    name: 'Transforming Math Education with Artificial intelligence',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/gc-trainer-5761.jpg'
},
{
    name: 'Project Based Learning in Mathematics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/online-teaching-5761.jpg'
},
{
    name: 'Gamification in Education: Making Learning Fun and Effective',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/google-certified-educators-homepage.jpg'
},
{
    name: 'Innovative Math Teaching: Incorporating STEP and Robotics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/08/microsft-certified-educators-homepage1.jpg'
},
{
    name: 'Transforming Math Education with Artificial intelligence',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/gc-trainer-5761.jpg'
},
{
    name: 'Project Based Learning in Mathematics',
    duration: '2 hours live workshop',
    image: 'https://www.upeducators.com/wp-content/uploads/2022/10/online-teaching-5761.jpg'
}];

const CoursesForEducators = () => {
    const CoursesCard = () => {
        return (
            SessionsData.map((item, index) => (
                <div className='card coursesCard' key={index}>
                    <img src={item.image} alt='' />
                    <div className='details'>
                        <h4>{item.name}</h4>
                        <p className='duration'>{item.duration}</p>
                        <Button type="button" title="View Course" />
                    </div>
                </div>
            ))
        )
    }
    return (
        <div className='content'>
            <h2>Courses for Educators</h2>
            <div className='flex-card'>
                <CoursesCard />
            </div>
        </div>
    )
};
export default CoursesForEducators;