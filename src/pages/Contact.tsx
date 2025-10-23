import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Music2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

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

    const elementsToAnimate = document.querySelectorAll(".fade-up");
    elementsToAnimate.forEach((el) => observer.observe(el));

    return () => {
      elementsToAnimate.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Asokwa, Kumasi", "Ashanti Region, Ghana"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+233 XX XXX XXXX"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@piwcasokwa.org",],
    },
    {
      icon: Clock,
      title: "Service Times",
      details: ["Sunday: 8:00 AM", "Wednesday: 5:30 PM", "Friday: 5:30 PM"],
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: "#", label: "Facebook", color: "hover:text-blue-600" },
    { icon: Instagram, url: "#", label: "Instagram", color: "hover:text-pink-600" },
    { icon: Youtube, url: "#", label: "Youtube", color: "hover:text-red-600" },
    { icon: Music2, url: "#", label: "TikTok", color: "hover:text-primary" },
  ];

  const latitude = 6.6770;
  const longitude = -1.5994;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3962.5607954472924!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdb9673b4b7b753%3A0x7a2c8c8f8f8f8f8f!2sPIWC%20Asokwa!5e1!3m2!1sen!2sgh!4v1234567890`;


  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact Us
            </h1>
            <p className="text-xl text-foreground/90">
              We'd love to hear from you. Reach out to us and we'll respond as soon as we can.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="frosted-glass text-center fade-up"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
                    <info.icon className="h-6 w-6 gradient-text" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground text-sm">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <Card className="frosted-glass fade-up">
              <CardContent className="pt-8">
                <h2 className="text-2xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full button-glow">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-8 fade-up" style={{ transitionDelay: '200ms' }}>
              <Card className="frosted-glass">
                <CardContent className="pt-8">
                  <h2 className="text-2xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Find Us
                  </h2>
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="PIWC Asokwa Location"
                    />
                  </div>
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="outline" className="w-full button-glow">
                      View Larger Map
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card className="frosted-glass">
                <CardContent className="pt-8">
                  <h2 className="text-2xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Connect With Us
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Follow us on social media to stay updated with our latest events, sermons, and announcements.
                  </p>
                  <div className="flex gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        aria-label={social.label}
                        className={`flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-primary transition-all duration-300 hover:scale-110 ${social.color}`}
                      >
                        <social.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Visit Us This Sunday
            </h2>
            <p className="text-xl text-foreground/90 mb-8">
              Experience the warmth of our community and the power of worship. You're always welcome at PIWC Asokwa!
            </p>
            <div className="text-lg space-y-2">
              <p className="font-semibold">Sunday Service: 8:00 AM</p>
              <p className="text-foreground/80">Asokwa, Kumasi, Ashanti Region</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
