import styles from './styles/Videos.module.css'
import Post from '../components/Post';

const Videos = () => {


  return (
    <div className={styles.container}>

      <Post type="video" />

    </div>
  )
}

export default Videos