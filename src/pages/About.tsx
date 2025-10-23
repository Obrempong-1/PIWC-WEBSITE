import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Users, BookOpen, ShieldCheck, UserCheck, Cross, HandHeart, Droplets, Wind, Church, HandCoins, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ImageModal from "@/components/ImageModal";
import MilestoneCard from "@/components/ui/MilestoneCard";
import { Database } from "@/integrations/supabase/types";
import { Skeleton } from "@/components/ui/skeleton";
import LazyImage from "@/components/ui/LazyImage";

interface Leader {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
}

const About = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [milestones, setMilestones] = useState<Database['public']['Tables']['milestones']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");
  const [modalAltText, setModalAltText] = useState("");
  const location = useLocation();

  const openModal = (imageUrl: string, altText: string) => {
    setModalImageUrl(imageUrl);
    setModalAltText(altText);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageUrl("");
    setModalAltText("");
  };


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (!loading) {
        const elementsToAnimate = document.querySelectorAll(".fade-up");
        elementsToAnimate.forEach((el) => observer.observe(el));
    
        return () => {
          elementsToAnimate.forEach((el) => observer.unobserve(el));
        };
    }
  }, [loading]);

  useEffect(() => {
    Promise.all([
        fetchLeaders(),
        fetchMilestones(),
    ]).then(() => {
      setLoading(false);
      if (location.hash === '#leaders') {
        setTimeout(() => {
          const element = document.getElementById('leaders');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 500); 
      }
    });
  }, [location.hash]);

  const fetchLeaders = async () => {
    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .eq("published", true)
      .order("display_order");

    if (!error && data) {
      setLeaders(data);
    }
  };

  const fetchMilestones = async () => {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .order("year");

    if (!error && data) {
        setMilestones(data);
    }
  };

  const tenets = [
    {
        icon: BookOpen,
        title: "The Bible",
        description: "We believe in the divine inspiration and authority of the Holy Scriptures. That the Bible is infallible in its declaration, final in its authority, all-sufficient in its provisions and comprehensive in its sufficiency.",
        scriptures: "2 Timothy 3:16; 2 Peter 1:21"
    },
    {
        icon: ShieldCheck,
        title: "The One True God",
        description: "We believe in the existence of the One True God, Elohim, Maker of the whole universe; indefinable, but revealed as True Godhead - Father, Son and Holy Spirit - one in nature, essence and attributes; Omnipotent, Omniscient and Omnipresent.",
        scriptures: "Genesis 1:1; Matthew 3:16-17; 2 Corinthians 13:14; Matthew 28:19; Genesis 1:26"
    },
    {
        icon: UserCheck,
        title: "Man's Depraved Nature",
        description: "We believe that: \"all men have sinned and come short of the glory of God;\" are subject to eternal punishment; and need repentance and regeneration.",
        scriptures: "Genesis 3:1-19; Isaiah 53:6"
    },
    {
        icon: Cross,
        title: "The Saviour",
        description: "We believe that man's need of a Saviour has been met in the person of Jesus Christ, because of His deity, virgin birth, sinless life, atoning death, resurrection and ascension; His abiding intercession and second coming.",
        scriptures: "John 8:46; 14:30; Colossians 1:15; 2 Corinthians 5:19; Romans 3:25; Acts 2:36; Philippians 2:9-11; 1 Thessalonians 4:3"
    },
    {
        icon: HandHeart,
        title: "Repentance, Justification, Sanctification",
        description: "We believe all men have to repent of and confess their sins before God and believe in the vicarious death of Jesus Christ to be justified before God. We believe in the sanctification of the believer through the working of the Holy Spirit and in God's gift of Eternal Life to the believer.",
        scriptures: "Acts 2:38; Luke 15:7; Romans 4:25; 5:16; 1 Corinthians 1:30; 1 Thessalonians 4:3"
    },
    {
        icon: Droplets,
        title: "The Sacraments of Baptism and The Lord's Supper",
        description: "We believe in the Sacrament of Baptism by immersion as a testimony of a convert who has attained a responsible age of about 15 years [Infants and children are not baptised but are dedicated to the Lord]. We believe in the Sacrament of the Lord's Supper which should be partaken of by all members who are in full fellowship.",
        scriptures: "Luke 3:21; Mark 16:16; Luke 2:22-24, 34; Mark 10:16; Luke 22:19-20; Matthew 26:21-29; Acts 20:7"
    },
    {
        icon: Wind,
        title: "Baptism, Gifts and Fruit of the Holy Spirit",
        description: "We believe in the Baptism of the Holy Spirit for believers with signs following; and in the operation of the gifts and the fruit of the Holy Spirit in the lives of believers.",
        scriptures: "1 Corinthians 12:8-11; Mark 16:17; Acts 2:4; Galatians 5:22"
    },
    {
        icon: Church,
        title: "Next Life",
        description: "We believe in the Resurrection of both the saved and the unsaved; they that are saved to the resurrection of life, and the unsaved to the resurrection of damnation.",
        scriptures: "John 5:28-29; Daniel 12:2; Romans 2:7, 6:23; Acts 20:35"
    },
    {
        icon: HandCoins,
        title: "Tithes and Offerings",
        description: "We believe in tithing and in the giving of free-will offerings towards the cause of carrying forward the Kingdom of God. We believe that God blesses a cheerful giver.",
        scriptures: "Malachi 3:10; Hebrews 7:1; Luke 6:38; Acts 20:35"
    },
    {
        icon: Heart,
        title: "Divine Healing",
        description: "We believe that the healing of sickness and disease is provided for God's people in the atonement. The Church is, however, not opposed to soliciting the help of qualified medical practitioners.",
        scriptures: "Isaiah 53:4-5; Matthew 8:7, 17; Mark 16:18; James 5:14-16; Luke 13:10-16"
    }
];

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              About Pentecost International Worship Centre - Asokwa
            </h1>
            <p className="text-xl text-foreground/90">
            Growing together in faith, hope, and love as a Christlike family that shines His light in every sphere of life.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div className="fade-up order-2 lg:order-1">
                <h3 className="text-2xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                  OUR VISION
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Our mission is to equip every believer to recognise and embrace their divine calling, and to deploy them into every sphere of life family, workplace, community, nation as transformative ambassadors of Christ. Rooted in the theme for this year, “Unleashed to Live a Life Worthy of Your Calling,” we are committed to fostering lives characterised by holiness, integrity, love and purpose, thereby making visible the values and principles of God’s Kingdom. We aim to strengthen each local assembly as a launch-pad for discipleship and impact, providing ministry, fellowship, mentorship and support so that members are not merely recipients of grace but active agents of change. Through empowering the youth, engaging in urban and rural missions, modelling servant-leadership and stewarding resources with wisdom, we seek to release the Church into the world in full measure. Ultimately, we envision a community where every follower of Christ lives boldly, works faithfully, serves sacrificially and influences ethically so that by 2025 and beyond we will see transformed lives and transformed societies, bringing honour to God and advancing His Kingdom on earth.
                </p>
            </div>
            <div className="fade-up order-1 lg:order-2 group relative h-96 overflow-hidden rounded-lg floating cursor-pointer" onClick={() => openModal("https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/vision.webp", "Our Vision")}>
                <LazyImage src="https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/vision.webp" alt="Our Vision" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" disableLqip={true} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center mt-20">
            <div className="fade-up group relative h-96 overflow-hidden rounded-lg floating cursor-pointer" onClick={() => openModal("https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/mission.jpg", "Our Mission")}>
                <LazyImage src="https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/mission.jpg" alt="Our Mission" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" disableLqip={true} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            <div className="fade-up">
                <h3 className="text-2xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Our mission is to equip every believer to recognise and embrace their divine calling, and to deploy them into every sphere of life family, workplace, community, nation as transformative ambassadors of Christ. Rooted in the theme for this year, “Unleashed to Live a Life Worthy of Your Calling,” we are committed to fostering lives characterised by holiness, integrity, love and purpose, thereby making visible the values and principles of God’s Kingdom. We aim to strengthen each local assembly as a launch-pad for discipleship and impact, providing ministry, fellowship, mentorship and support so that members are not merely recipients of grace but active agents of change. Through empowering the youth, engaging in urban and rural missions, modelling servant-leadership and stewarding resources with wisdom, we seek to release the Church into the world in full measure. Ultimately, we envision a community where every follower of Christ lives boldly, works faithfully, serves sacrificially and influences ethically so that by 2025 and beyond we will see transformed lives and transformed societies, bringing honour to God and advancing His Kingdom on earth.
                </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-up">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    The Tenets of The Church of Pentecost
                </h2>
                <p className="text-muted-foreground">The foundational beliefs that anchor our faith</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {tenets.map((tenet, index) => (
                    <Card
                        key={index}
                        className="frosted-glass text-left fade-up"
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <CardContent className="pt-8">
                            <div className="flex items-start gap-6">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <tenet.icon className="h-8 w-8 gradient-text" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-primary mb-3">{tenet.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4">{tenet.description}</p>
                                    <p className="text-xs text-muted-foreground/80 italic">{tenet.scriptures}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>

    <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-up">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Our Journey Through Time
                </h2>
                <p className="text-muted-foreground">Milestones of faith, growth, and God's faithfulness</p>
            </div>

            {loading ? (
              <div className="max-w-5xl mx-auto relative">
                {[...Array(3)].map((_, index) => (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 mb-12" key={index}>
                    {index % 2 === 0 ? (
                      <>
                        <div className="text-right pr-8">
                          <Skeleton className="h-8 w-48 mb-4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <Skeleton className="h-48 w-full" />
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <div className="text-left pl-8">
                          <Skeleton className="h-8 w-48 mb-4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4 mt-2" />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                
                <div className="max-w-5xl mx-auto relative hidden md:block">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-primary/10 rounded-full"></div>
                    {milestones.map((milestone, index) => (
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-8 mb-12" key={milestone.id}>
                            {index % 2 === 0 ? (
                                <>
                                    <div className="text-right fade-up pr-8">
                                        <h3 className="text-2xl font-bold text-primary mb-2">{milestone.year} - {milestone.event}</h3>
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: milestone.description.substring(0, 150) + '...' }} />
                                    </div>
                                    <div className="relative h-full flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-primary/30 border-4 border-primary/10"></div>
                                    </div>
                                    <div className="fade-up pl-8">
                                        <MilestoneCard milestone={milestone} />
                                    </div>
                                </> 
                            ) : (
                                <>
                                    <div className="fade-up pr-8">
                                        <MilestoneCard milestone={milestone} />
                                    </div>
                                    <div className="relative h-full flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-primary/30 border-4 border-primary/10"></div>
                                    </div>
                                    <div className="text-left fade-up pl-8">
                                        <h3 className="text-2xl font-bold text-primary mb-2">{milestone.year} - {milestone.event}</h3>
                                        <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: milestone.description.substring(0, 150) + '...' }} />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

               
                <div className="md:hidden">
                    {milestones.map((milestone) => (
                        <div className="flex gap-4 mb-12" key={milestone.id}>
                            <div className="flex flex-col items-center">
                                <div className="w-5 h-5 rounded-full bg-primary/30 border-4 border-primary/10"></div>
                                <div className="flex-grow w-px bg-primary/20"></div>
                            </div>
                            <div className="flex-1">
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-primary">{milestone.year}</h3>
                                    <p className="text-muted-foreground">{milestone.event}</p>
                                </div>
                                <MilestoneCard milestone={milestone} />
                            </div>
                        </div>
                    ))}
                </div>
              </>
            )}
        </div>
    </section>

      <section id="leaders" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              PIWC ASOKWA PRESBITORY
            </h2>
            <p className="text-muted-foreground">The highest decision making body of the church.</p>
          </div>
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
             {[...Array(4)].map((_, index) => (
               <div key={index} className="frosted-glass overflow-hidden group h-full">
                 <Skeleton className="h-64 w-full" />
                 <div className="pt-4 text-center">
                   <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                   <Skeleton className="h-4 w-1/2 mx-auto" />
                 </div>
               </div>
             ))}
           </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {leaders.map((leader, index) => (
                <Link to={`/leader/${leader.id}`} key={leader.id}>
                  <Card
                    className="frosted-glass overflow-hidden group fade-up h-full"
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative h-64 overflow-hidden bg-black">
                      {leader.image_url ? (
                        <>
                           <LazyImage
                            src={leader.image_url}
                            alt={leader.name}
                            className="relative w-full h-full object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                            disableLqip={true} 
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-20 w-20 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 text-center">
                      <h3 className="text-lg font-semibold text-primary mb-1">{leader.name}</h3>
                      <p className="text-sm text-primary/70 font-medium">{leader.role}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <ImageModal isOpen={isModalOpen} onClose={closeModal} imageUrl={modalImageUrl} altText={modalAltText} />
    </div>
  );
};

export default About;
