import React from "react";
import Image from "next/image";
import {
  ThunderboltOutlined,
  HeartOutlined,
  TrophyOutlined,
  SafetyOutlined,
  DollarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import FeaturesHighlight from "../../components/FeaturesHighlight/FeaturesHighlight";
import styles from "./About.module.scss";

const About: React.FC = () => {
  const featuresData = {
    title: "Điểm nổi bật",
    carImage: {
      src: "/images/car-feature.jpg",
      alt: "Xe điện cao cấp",
    },
    leftFeatures: [
      {
        icon: <TrophyOutlined />,
        title: "Dịch vụ cao cấp",
        description:
          "Nơi sang trọng gặp gỡ sự chăm sóc đặc biệt, tạo ra những khoảnh khắc khó quên và vượt xa mọi mong đợi của bạn.",
      },
      {
        icon: <SafetyOutlined />,
        title: "Hỗ trợ 24/7",
        description:
          "Hỗ trợ đáng tin cậy khi bạn cần nhất, giúp bạn di chuyển tự tin và yên tâm trên mọi hành trình.",
      },
    ],
    rightFeatures: [
      {
        icon: <DollarOutlined />,
        title: "Giá cả hợp lý",
        description:
          "Mở khóa sự xuất sắc với giá cả phải chăng, nâng cao chất lượng trong khi giảm thiểu chi phí để đạt giá trị tối đa.",
      },
      {
        icon: <EnvironmentOutlined />,
        title: "Giao nhận xe miễn phí",
        description:
          "Tận hưởng dịch vụ giao nhận xe miễn phí, thêm một lớp tiện lợi cho trải nghiệm thuê xe của bạn.",
      },
    ],
  };

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Về EVS Rent</h1>
            <p className={styles.heroSubtitle}>
              Dẫn đầu cuộc cách mạng di chuyển xanh tại Việt Nam
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className={styles.story}>
        <div className={styles.container}>
          <div className={styles.storyContent}>
            <div className={styles.storyText}>
              <h2 className={styles.sectionTitle}>
                Dẫn đầu di chuyển xanh
              </h2>
              <p className={styles.storyDescription}>
                Chúng tôi là những người tiên phong trong cuộc cách mạng di
                chuyển xanh tại Việt Nam. Mỗi chuyến đi cùng EVS Rent không chỉ
                là một dịch vụ thuê xe, mà là một bước tiến hướng tới tương lai
                bền vững.
              </p>
              <p className={styles.storyDescription}>
                Từ những ngày đầu với niềm đam mê về công nghệ xanh, chúng tôi
                đã xây dựng một hệ sinh thái hoàn chỉnh - từ xe máy điện đến ô
                tô điện, từ dịch vụ thuê đến trải nghiệm di chuyển thông minh.
              </p>
              <p className={styles.storyDescription}>
                Chúng tôi tin rằng mỗi người dân Việt Nam đều xứng đáng có cơ
                hội trải nghiệm công nghệ tiên tiến và góp phần bảo vệ môi
                trường thông qua những lựa chọn di chuyển thông minh.
              </p>
            </div>
            <div className={styles.storyImage}>
              <Image 
                src="/images/welcome-image.jpg" 
                alt="EVS Rent Story" 
                width={500}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

       {/* Mission & Vision */}
       <section className={styles.mission}>
         <div className={styles.container}>
           <div className={styles.missionCard}>
             <div className={styles.missionIcon}>
               <ThunderboltOutlined />
             </div>
             <h2 className={styles.missionTitle}>SỨ MỆNH</h2>
             <p className={styles.missionDescription}>
               Mang đến giải pháp di chuyển xanh, tiết kiệm và thân thiện với môi
               trường cho mọi người dân Việt Nam. Chúng tôi cam kết cung cấp dịch vụ
               thuê xe điện chất lượng cao, an toàn và tiện lợi, góp phần giảm thiểu
               ô nhiễm môi trường và xây dựng một cộng đồng xanh bền vững.
             </p>
           </div>

           <div className={styles.visionCard}>
             <div className={styles.visionIcon}>
               <HeartOutlined />
             </div>
             <h2 className={styles.visionTitle}>TẦM NHÌN</h2>
             <p className={styles.visionDescription}>
               Trở thành công ty cho thuê xe điện hàng đầu Việt Nam, góp phần xây
               dựng một tương lai bền vững. Chúng tôi hướng tới việc tạo ra một hệ sinh
               thái di chuyển xanh hoàn chỉnh, từ xe máy điện đến ô tô điện, từ dịch vụ
               thuê đến trải nghiệm di chuyển thông minh, mang lại giá trị bền vững cho
               cộng đồng và môi trường.
             </p>
           </div>
         </div>
       </section>

      {/* Features Highlight */}
      <FeaturesHighlight {...featuresData} />

    </div>
  );
};

export default About;
