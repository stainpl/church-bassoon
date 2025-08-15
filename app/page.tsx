'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const HERO_BG = '/home.jpg' 
const SHUFFLE_IMAGES = [
  { src: '/image1.png', name: 'Alice', title: 'Worship Leader' },
  { src: '/image2.png', name: 'Bob', title: 'Youth Pastor' },
  { src: '/image3.png', name: 'Carol', title: 'Choir Director' },
  { src: '/image4.png', name: 'Dave', title: 'Volunteer' },
]
const LOOP_VIDEO = '/loop-video.mp4' 

export default function HomePage() {
  // Image shuffler state
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % SHUFFLE_IMAGES.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-24">

      {/* Hero */}
      <section
        className="h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      >
        <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg text-center">
        Laboris duis ullamco ipsum nisi do consectetur cupidatat
        </h1>
      </section>

      {/* 1. Big Text Card */}
      <section className="container mx-auto px-6">
  <div className="bg-white p-12 rounded-lg shadow-lg">
    
    <p className="text-3xl leading-relaxed italic">
      “Lorem ipsum dolor sit amet, nisi nisi sed. Do laboris enim labore amet elit esse in irure labore. 
      Voluptate ullamco laborum proident do labore fugiat officia pariatur cillum proident aliqua.”
    </p>
    <p className="mt-4 text-right font-medium">
      — Pastor Udomeje
    </p>
  </div>
</section>

      {/* 2. Image Shuffler */}
      <section className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
        <div className="w-full md:w-1/2">
          <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-lg shadow-lg transform transition-transform duration-500 hover:rotate-3 hover:-translate-y-2">
            <Image
              src={SHUFFLE_IMAGES[idx].src}
              alt={SHUFFLE_IMAGES[idx].name}
              width={320}
              height={320}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-2xl font-semibold">{SHUFFLE_IMAGES[idx].name}</h3>
          <p className="italic text-gray-600">{SHUFFLE_IMAGES[idx].title}</p>
        </div>
      </section>

      {/* 3. YouTube Embed Placeholder */}
      <section className="container mx-auto px-6">
        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
          {/* Replace src with your video URL when ready */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/VIDEO_ID"
            title="Church Video"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </section>

      {/* 4. Static Cover Card */}
      <section className="container mx-auto px-6">
        <div className="bg-cover bg-center h-64 rounded-lg shadow-lg relative" style={{ backgroundImage: `url('/cover-photo.jpg')` }}>
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg p-6 flex flex-col justify-end">
            <h2 className="text-3xl text-white font-bold">Our Story</h2>
            <p className="text-white mt-2">Discover how our community began and grew.</p>
            <Link href="/our-story" className="mt-4 inline-flex items-center text-white font-medium hover:underline">
                View More →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Blog Section */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 1, cover: '/blog1.jpg', title: 'Hope in Action', desc: 'How our outreach program changes lives.' },
            { id: 2, cover: '/blog2.jpg', title: 'Faith & Fellowship', desc: 'Building deeper connections.' },
            { id: 3, cover: '/blog3.jpg', title: 'Journey of Service', desc: 'Stories from our volunteers.' },
          ].map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image src={post.cover} alt={post.title} width={400} height={250} className="object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{post.title}</h3>
                <p className="text-gray-600 mt-2">{post.desc}</p>
                <Link href={`/blog/${post.id}`} className="mt-3 inline-flex items-center text-blue-600 hover:underline">
                    Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Looping Video */}
      <section className="container mx-auto px-6">
        <video
          src={LOOP_VIDEO}
          autoPlay
          muted
          loop
          className="w-full rounded-lg shadow-lg object-cover"
        />
      </section>

      {/* 7. Activities Schedule */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold mb-6 text-center">Weekly Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { day: 'Sunday', time: '9:00 AM Worship' },
            { day: 'Tuesday', time: '7:00 PM Bible Study' },
            { day: 'Thursday', time: '6:00 PM Youth Group' },
          ].map(act => (
            <div key={act.day} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <h3 className="text-xl font-medium">{act.day}</h3>
              <p className="mt-2 text-gray-600">{act.time}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="border-gray-300 my-12" />

      {/* Useful Links & Headlines */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '📅', label: 'Events', href: '/events' },
            { icon: '📖', label: 'Sermons', href: '/sermons' },
            { icon: '🤝', label: 'Donate', href: '/donate' },
            { icon: '✉️', label: 'Contact', href: '/contact' },
          ].map(link => (
            <Link key={link.label} href={link.href} className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow hover:bg-gray-50">
                <span className="text-2xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-6 text-center md:flex md:justify-between">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Church Pilar. All rights reserved.
          </div>
          <div className="space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms </Link>
            <Link href="/contact" className="hover:underline">Contact </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
