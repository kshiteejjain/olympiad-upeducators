import AnkitaShawImage from '/src/assets/ankita-shaw.png';
import AnkushBhandariImage from '/src/assets/ankush-bhandari.png';
import LopamudraImage from '/src/assets/lopamudra.png';
import ManjuImage from '/src/assets/manju.png';
import MuktaImage from '/src/assets/mukta.png';
import NanjappaImage from '/src/assets/nanjappa.png';
import NishitaImage from '/src/assets/nishita.png';
import ShephaliImage from '/src/assets/shepali.png';

const TeachersData = [{
    name: 'Ms. Ankita Shaw',
    data: 'AI In Primary Education: Shaping Tomorrow’s Classrooms',
    designation: 'Google Certified Trainer, Microsoft Certified Trainer, Trained 3000+ Educators on AI in Education',
    image: AnkitaShawImage
},
{
    name: 'Ms. Nishita Israni',
    data: 'Mastering Effective Assessment Methodologies',
    designation: 'Ex Vice Principal, Trained 1000+ Teachers in Innovative Teaching Practices',
    image: NishitaImage
},
{
    name: 'Ms. Mukta Sareen',
    data: 'Project-based Learning: Bridging Theory and Practice',
    designation: '10 years of Teaching experience in International Schools, Microsoft Certified Educator',
    image: MuktaImage
},
{
    name: 'Ms. Lopamudra Mohanty',
    data: 'Art of Storytelling: Engaging Young Minds through Stories',
    designation: 'TedX Speaker | Storyteller| Founder, BBW Education Pvt Ltd, Cheers2Bhasha',
    image: LopamudraImage
},
{
    name: 'Ms. Manju Borkar',
    data: 'STEM for Primary Education: Building Future Innovators',
    designation: 'Ex Principal, Expert in STEM Education, Google Certified Trainer',
    image: ManjuImage
},
{
    name: 'Ms. Shephali Saxena',
    data: 'Technology in Primary Education: Nurturing Brilliance',
    designation: 'Google Certified Trainer, 10 years of Experience in Primary & Pre Primary Teaching',
    image: ShephaliImage
},
{
    name: 'Mr. Ankush Bhandari',
    data: 'Building a Free Teaching Portfolio Website',
    designation: 'Google Certified Trainer, Trained 5000+ Educators on building a Website',
    image: AnkushBhandariImage
},
{
    name: 'Mr. Nanjappa KC',
    data: 'Create Engaging Learning Materials using Canva',
    designation: 'Google Certified Trainer, Trained 5000+ Educators on Design skills using Canva',
    image: NanjappaImage
}];

const LiveMasterClass = () => {

    const Card = () => {
        return (
            TeachersData.map((item, index) => (
                <div className='card teachers-card' key={index}>
                    <img src={item.image} alt='' />
                    <div className='details'>
                        <h4>{item.name}</h4>
                        <p className='designation'>{item.data}</p>
                        <p>{item.designation}</p>
                    </div>
                </div>
            ))
        );
    }

    return (
        <div className='content'>
            <h2>Live Master Class</h2>
            <p>upEducators will organize 8 Expert-Led Live Training sessions for all the educators attending this Olympiad. These Masterclasses will be conducted after the Result Announcement.</p>
            <div className='flex-card'>
                <Card />
            </div>
        </div>
    );
};

export default LiveMasterClass;
