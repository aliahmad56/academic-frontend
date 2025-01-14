import { ColorRing } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div style={styles.loaderContainer}>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#FFFFFF', '#1DAEDE', '#FFFFFF', '#1DAEDE', '#FFFFFF']}
      />
    </div>
  );
};

const styles: any = {
  loaderContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent overlay
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // ensure the loader is on top of everything
  },
};

export default Loader;
