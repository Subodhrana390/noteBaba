import { motion } from "framer-motion";
import HeroImg from "../assets/Hero.gif";
import "../styles/Hero.scss";

const Hero = () => {
  return (
    <motion.div
      className="Hero_section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <motion.div
        className="Hero_img"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <img src={HeroImg} alt="Hero" />
      </motion.div>
      <motion.div
        className="Hero_content"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, x: 50, rotate: 10 },
          visible: {
            opacity: 1,
            x: 0,
            rotate: 0,
            transition: {
              delay: 0.5,
              duration: 1.2,
              ease: "easeOut",
              when: "beforeChildren",
              staggerChildren: 0.3,
            },
          },
        }}
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Start Studying Smarter Today! <span></span>
        </motion.h1>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Introducing the ultimate college notes website! Boost your studies
          with our diverse collection of class notes, assignments, mid-semester
          papers, end-semester papers, coding resources, and much more. Our
          platform offers a user-friendly and interactive experience, making it
          easier than ever to access and organize all your study materials.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
