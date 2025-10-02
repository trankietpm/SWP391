import React from 'react'
import styles from './Homepage.module.scss'
import Hero from '@/components/Hero/Hero'
import Welcome from '@/components/Welcome/Welcome'
import FeaturesHighlight from '@/components/FeaturesHighlight/FeaturesHighlight'
import {
  EnvironmentOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import PopularVehicles from '@/components/PopularVehicles/PopularVehicles'

function Homepage() {
  const whyChooseUsData = {
    title: "Tại sao chọn chúng tôi?",
    carImage: {
      src: "/images/car.png",
      alt: "Xe điện EVS Rent",
    },
    leftFeatures: [
      {
        icon: <EnvironmentOutlined />,
        title: "Thân thiện môi trường",
        description:
          "Xe điện không phát thải khí CO2, góp phần bảo vệ môi trường và giảm ô nhiễm không khí.",
      },
      {
        icon: <SafetyOutlined />,
        title: "An toàn tuyệt đối",
        description:
          "Tất cả xe đều được kiểm tra kỹ lưỡng, bảo hiểm đầy đủ và có hệ thống an toàn hiện đại.",
      },
      {
        icon: <ThunderboltOutlined />,
        title: "Tiết kiệm chi phí",
        description:
          "Chi phí vận hành thấp hơn 70% so với xe xăng, tiết kiệm đáng kể cho ngân sách của bạn.",
      },
    ],
    rightFeatures: [
      {
        icon: <DollarOutlined />,
        title: "Giá cả hợp lý",
        description:
          "Bảng giá minh bạch, không phí ẩn, nhiều gói ưu đãi hấp dẫn cho khách hàng thân thiết.",
      },
      {
        icon: <HeartOutlined />,
        title: "Dịch vụ tận tâm",
        description:
          "Đội ngũ nhân viên chuyên nghiệp, sẵn sàng hỗ trợ 24/7 để mang đến trải nghiệm tốt nhất.",
      },
      {
        icon: <ClockCircleOutlined />,
        title: "Giao xe nhanh chóng",
        description:
          "Hệ thống đặt xe thông minh, giao xe trong vòng 30 phút tại bất kỳ đâu trong thành phố.",
      },
    ],
  }

  return (
    <div className={styles.homepage}>
      <div className={styles.hero}>
        <Hero />
      </div>
      <div className={styles.welcome}>
        <Welcome />
      </div>
      <div className={styles.whyChooseUs}>
        <FeaturesHighlight {...whyChooseUsData} />
      </div>
      <div className={styles.popularVehicles}>
        <PopularVehicles />
      </div>
    </div>
  )
}

export default Homepage