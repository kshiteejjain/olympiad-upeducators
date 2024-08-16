const TeachersData = [{
    name: 'Ms. Sangeeta Gulati',
    data: 'Unleashing The Power of Play. How Digital manipulatives Can Boost Math Learning',
    designation: 'National ICT Awardee 2016, HOD Mathematics at Sanskriti School, New Delhi',
    image: 'https://media.istockphoto.com/id/678420920/photo/portrait-of-an-indian-lady-teacher.jpg?s=612x612&w=0&k=20&c=N46IVDbat0L9cZgU3lFwcP_hqufN-BRrM1RJHCZlBzc='
},
{
    name: 'Mr. Manoj Kumar Singh',
    data: 'Topic: Innovative Teaching Strategies in Math',
    designation: 'National ICT Awardee 2021, Math and Science Teacher, Hindustan Mitra Mandal Middle School, Jharkhand',
    image: 'https://img.freepik.com/premium-photo/indian-male-teacher-smiling-classroom_856987-1606.jpg'
},
{
    name: 'Ms. Achala Verma',
    data: 'Beyond Blackboards: Exploring Math"s Motion with GeoGebra,',
    designation: 'National ICT Awardee 2021, Dean Academics, Birla Balika Vidhyapeeth, Pilani',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/041/955/211/small_2x/ai-generated-portrait-of-a-smiling-indian-female-teacher-standing-with-arms-crossed-in-classroom-photo.jpg'
},
{
    name: 'Ms. Sangeeta Gulati',
    data: 'Unleashing The Power of Play. How Digital manipulatives Can Boost Math Learning',
    designation: 'National ICT Awardee 2016, HOD Mathematics at Sanskriti School, New Delhi',
    image: 'https://img.freepik.com/premium-photo/indian-female-teacher-writing-chalkboard-classroom-school-education-concept_979520-60588.jpg'
}];

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
}];

const LiveMasterClass = () => {

    const Card = () => {
        return (
            TeachersData.map((item, index) => (
                <div className='card' key={index}>
                    <img src={item.image} alt='' />
                    <div className='details'>
                        <h4>{item.name}</h4>
                        <p className='designation'>{item.data}</p>
                        <p>{item.designation}</p>
                    </div>
                </div>
            ))
        )
    }

    const CoursesCard = () => {
        return (
            SessionsData.map((item, index) => (
                <div className='card coursesCard' key={index}>
                    <img src={item.image} alt='' />
                    <div className='details'>
                        <h4>{item.name}</h4>
                        <p className='duration'>{item.duration}</p>
                    </div>
                </div>
            ))
        )
    }

    return (
        <div className='content'>
            <h2>Live Master Class</h2>
            <p>upEducators will organize 8 Expert-Led Live Training sessions for all the educators attending this Olympiad. These Masterclasses will be conducted after the Result Announcement.</p>
            <div className='flex-card'>
                <h3>4 Exclusive Session by National Awardee Teacher</h3>
                <Card />

                <h3>4 Engaging Session by upEducators Expert Trainers</h3>
                <CoursesCard />
            </div>
        </div>
    )
};
export default LiveMasterClass;