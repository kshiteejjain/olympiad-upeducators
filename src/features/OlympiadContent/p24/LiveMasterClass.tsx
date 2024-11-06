const TeachersData = [{
    name: 'Ms. Ankita Shaw',
    data: 'AI In Primary Education: Shaping Tomorrow’s Classrooms',
    designation: 'Google Certified Trainer, Microsoft Certified Trainer, Trained 3000+ Educators on AI in Education',
    image: 'https://media.istockphoto.com/id/678420920/photo/portrait-of-an-indian-lady-teacher.jpg?s=612x612&w=0&k=20&c=N46IVDbat0L9cZgU3lFwcP_hqufN-BRrM1RJHCZlBzc='
},
{
    name: 'Ms. Nishita Israni',
    data: 'Mastering Effective Assessment Methodologies',
    designation: 'Ex Vice Principal, Trained 1000+ Teachers in Innovative Teaching Practices',
    image: 'https://img.freepik.com/premium-photo/indian-male-teacher-smiling-classroom_856987-1606.jpg'
},
{
    name: 'Ms. Mukta Sareen',
    data: 'Project-based Learning: Bridging Theory and Practice',
    designation: '10 years of Teaching experience in International Schools, Microsoft Certified Educator',
    image: 'https://static.vecteezy.com/system/resources/thumbnails/041/955/211/small_2x/ai-generated-portrait-of-a-smiling-indian-female-teacher-standing-with-arms-crossed-in-classroom-photo.jpg'
},
{
    name: 'Ms. Lopamudra Mohanty',
    data: 'Art of Storytelling: Engaging Young Minds through Stories',
    designation: 'TedX Speaker | Storyteller| Founder, BBW Education Pvt Ltd, Cheers2Bhasha',
    image: 'https://img.freepik.com/premium-photo/indian-female-teacher-writing-chalkboard-classroom-school-education-concept_979520-60588.jpg'
},
{
    name: 'Ms. Manju Borkar',
    data: 'STEM for Primary Education: Building Future Innovators',
    designation: 'Ex Principal, Expert in STEM Education, Google Certified Traine',
    image: 'https://img.freepik.com/premium-photo/indian-female-teacher-writing-chalkboard-classroom-school-education-concept_979520-60588.jpg'
},
{
    name: 'Ms. Shephali Saxena',
    data: 'Technology in Primary Education: Nurturing Brilliance',
    designation: 'Google Certified Trainer, 10 years of Experience in Primary & Pre Primary Teaching',
    image: 'https://img.freepik.com/premium-photo/indian-female-teacher-writing-chalkboard-classroom-school-education-concept_979520-60588.jpg'
},
{
    name: 'Mr. Ankush Bhandari',
    data: 'Building a Free Teaching Portfolio Website',
    designation: 'Google Certified Trainer, Trained 5000+ Educators on building a Website',
    image: 'https://img.freepik.com/premium-photo/indian-female-teacher-writing-chalkboard-classroom-school-education-concept_979520-60588.jpg'
},
{
    name: 'Mr. Nanjappa KC',
    data: 'Create Engaging Learning Materials using Canva',
    designation: 'Google Certified Trainer, Trained 5000+ Educators on Design skills using Canva',
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