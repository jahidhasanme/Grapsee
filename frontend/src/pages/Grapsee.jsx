import styles from './styles/Grapsee.module.css'
import GrapseeImageGold from '../assets/grapsee_gold.png'
import { useMediaQuery, useTheme } from '@mui/material';

const Grapsee = () => {

  const theme = useTheme()

  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:960px)');
  const isDesktop = useMediaQuery('(min-width:960px)');

  return (
    <div className={styles.container}>

      <img src={GrapseeImageGold} className={ styles.grapseeImageGold } alt='Loading...' />

      <h1>Who are you?</h1>
      <span style={{ marginTop: '12px', fontSize: '18px', textAlign: 'center' }}>Chooese the right subcriptions for you:</span>

      <div className={ styles.subscriptionPlan}>
        <span style={{ fontSize: !isMobile ? '25px' : '19px', textShadow: '-1px -1px 2px orangered'}}>Premium</span>
        <span style={{ fontSize: !isMobile ? '35px' : '24px', margin: '12px 0px', fontWeight: 'bold'}}>I'am an individual</span>
        <span style={{ fontSize: !isMobile ? '20px' : '16px' }}>For individual content creator & personal business, growth business</span>
      </div>

      <div className={ styles.subscriptionPlan}>
        <span style={{ fontSize: !isMobile ? '25px' : '19px', textShadow: '-1px -1px 2px blue'}}>Verified organization</span>
        <span style={{ fontSize: !isMobile ? '35px' : '24px', margin: '12px 0px', fontWeight: 'bold'}}>I'am an organization</span>
        <span style={{ fontSize: !isMobile ? '20px' : '16px' }}>For business, government agencies and non profit</span>
      </div>

    </div>
  )
}

export default Grapsee