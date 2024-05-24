import styles from './styles/Sponsors.module.css'
import intro_1 from '../assets/intro_1.mp4';
import intro_2 from '../assets/intro_2.mp4';
import intro_3 from '../assets/intro_3.mp4';
import banner_1 from '../assets/banner_1.jpg';
import banner_2 from '../assets/banner_2.jpg';
import banner_3 from '../assets/banner_3.jpg';

const Sponsors = () => {
  return (
    <div className={styles.container}>
      <video className={styles.banner} src={intro_1} poster={banner_1} alt='Loading...' loop autoPlay></video>
      <video className={styles.banner} src={intro_2} poster={banner_2} alt='Loading...' loop autoPlay></video>
      <video className={styles.banner} src={intro_3} poster={banner_3} alt='Loading...' loop autoPlay></video>
      <img className={styles.banner} src={banner_1} alt='Loading...' />
      <img className={styles.banner} src={banner_2} alt='Loading...' />
      <img className={styles.banner} src={banner_3} alt='Loading...' />
    </div>
  )
}

export default Sponsors