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
    data: 'Transforming Science Education with Artificial Intelligence',
    image: AnkitaShawImage
},
{
    name: 'Ms. Nishita Israni',
    data: 'Design Thinking for 21st-Century Educators',
    image: NishitaImage
},
{
    name: 'Ms. Mukta Sareen',
    data: 'Gamification in Education: Making Learning Fun and Effective',
    image: MuktaImage
},
{
    name: 'Ms. Lopamudra Mohanty',
    data: 'Innovative Science Teaching: Incorporating STEM and Robotics',
    image: LopamudraImage
},
{
    name: 'Ms. Manju Borkar',
    data: 'Project-based Learning: Bridging Theory and Practice',
    image: ManjuImage
},
{
    name: 'Ms. Shephali Saxena',
    data: 'Storytelling in Science',
    image: ShephaliImage
},
{
    name: 'Mr. Ankush Bhandari',
    data: 'Building a Free Teaching Portfolio Website',
    image: AnkushBhandariImage
},
{
    name: 'Mr. Nanjappa KC',
    data: 'Technology in Science Education',
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
