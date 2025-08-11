'use client';
import { useScrollAnimation, animationPresets } from "../../hooks/useScrollAnimation";
import { useMagnetic } from "../../hooks/useAdvancedScrollEffects";

export default function Features() {
  const [feature1Ref, feature1Visible] = useScrollAnimation({ delay: 100 });
  const [feature2Ref, feature2Visible] = useScrollAnimation({ delay: 200 });
  const [feature3Ref, feature3Visible] = useScrollAnimation({ delay: 300 });

  // Magnetic effects for feature cards
  const [magneticRef1, magneticStyle1] = useMagnetic(0.15);
  const [magneticRef2, magneticStyle2] = useMagnetic(0.15);
  const [magneticRef3, magneticStyle3] = useMagnetic(0.15);

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: "Search for cheap car rental in seconds – anywhere in the world",
      gradient: "from-orange-500 to-red-500",
      magneticRef: magneticRef1,
      magneticStyle: magneticStyle1,
      animationRef: feature1Ref,
      isVisible: feature1Visible
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Compare deals from trusted car rental providers in one place",
      gradient: "from-blue-500 to-purple-500",
      magneticRef: magneticRef2,
      magneticStyle: magneticStyle2,
      animationRef: feature2Ref,
      isVisible: feature2Visible
    },
    {
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Rent a car with a flexible booking policy or free cancellation",
      gradient: "from-green-500 to-teal-500",
      magneticRef: magneticRef3,
      magneticStyle: magneticStyle3,
      animationRef: feature3Ref,
      isVisible: feature3Visible
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <p>ffffff</p>
    </section>
  );
}