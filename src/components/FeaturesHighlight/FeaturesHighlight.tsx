import React from "react";
import Image from "next/image";
import styles from "./FeaturesHighlight.module.scss";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface FeaturesHighlightProps {
  title: string;
  carImage: {
    src: string;
    alt: string;
  };
  leftFeatures: Feature[];
  rightFeatures: Feature[];
}

const FeaturesHighlight: React.FC<FeaturesHighlightProps> = ({
  title,
  carImage,
  leftFeatures,
  rightFeatures,
}) => {
  return (
    <section className={styles.featuresHighlight}>
      <div className={styles.container}>
        <h2 className={styles.featuresTitle}>{title}</h2>
        <div className={styles.featuresContent}>
          <div className={styles.featuresLeft}>
            {leftFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.carImage}>
            <Image
              src={carImage.src}
              alt={carImage.alt}
              width={600}
              height={400}
            />
          </div>

          <div className={styles.featuresRight}>
            {rightFeatures.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesHighlight;
