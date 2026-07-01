'use client';
import Modal from './Modal';

export default function AboutModal({
  isClosing,
  onClose,
}: {
  isClosing: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      isClosing={isClosing}
      onClose={onClose}
      titleId="about-modal-title"
      sizeClass="max-w-5xl"
    >
      <div className="pr-8">
        <h2 id="about-modal-title" className="text-xl font-bold">
          About
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed">
          <p>
            This is a site that displays my favorite Billboard hit songs in order. All the songs
            come from the{' '}
            <a
              href="https://www.billboard.com/charts/year-end/"
              className="text-lime-700 hover:text-lime-600 duration-300 underline decoration-solid"
            >
              Billboard Year-End Hot 100 charts
            </a>
            , which list the top 100 biggest songs of each year according to Billboard, all the way
            back to 1959. This is not a list of my <i>favorite</i> songs of all time, only those
            that are "hits" by my definition of making a Billboard Year-End Hot 100 list. Keep in
            mind that some songs make more than one year-end list (especially if they were popular
            toward the end of a year and charted in the winter between two years), but I only count
            each individual song once, for the first year they appeared on a Billboard year-end
            list.
          </p>
          <p>
            The idea for this website came from my various{' '}
            <a
              href="https://www.youtube.com/playlist?list=PLdViXKJLgLoICH9IJIp4XnpgLqTvx9Kue"
              className="text-lime-700 hover:text-lime-600 duration-300 underline decoration-solid"
            >
              YouTube videos
            </a>{' '}
            discussing the best and worst hit songs of the current year, including a series on{' '}
            <a
              href="https://www.youtube.com/playlist?list=PLdViXKJLgLoJnrsx3aEcvHYMAkOXRBbMQ"
              className="text-lime-700 hover:text-lime-600 duration-300 underline decoration-solid"
            >
              the top 10 best hit songs of every year from 2000-2019
            </a>{' '}
            (which is still currently in progress as of you reading this). At the end of the series,
            I plan to reveal the top 100 best hit songs of all of 2000-2019 combined (by the way, if
            you haven't watched my best hit songs videos, then this site spoils my picks for those
            videos as well as the upcoming videos in that series, sorry). However, I decided to take
            this idea a step further. I decided to make a site listing my top 1000 favorite
            Billboard year-end hits of all time. This project is still in development and, as of
            right now, does not yet contain 1000 songs. There are many years I still need to listen
            to in order to determine my favorite hits of those years, especially years before I was
            born. But when complete, it will indeed list my top 1000 favorite Billboard year-end
            hits.
          </p>
          <p>
            Beyond my love for music, another reason I decided to make this website is because
            opinions change over time. So rather than keep making new videos with my updated
            opinions every time a hit song later grows on me, I thought it would be better to refer
            people to a site that contains my most up-to-date opinions. This site has an admin
            backend that allows me to update the database storing my songs, which easily allows me
            to add new songs (which I will do at the end of each year when a new Billboard year-end
            list comes out, I've listened through it and sorted the best songs in order of quality
            and compared them with every song already in this list) and reorder them if one song
            grows/cools on me over time.
          </p>
          <p>
            I've also added functionality that allows users to view my top 100 favorite hit songs of
            a particular decade and top 20 favorite hit songs of a particular year. You can even use
            the search button to search for a certain song or artist and see if your favorite artist
            or hit song has any songs in my top 1000. You can also click on a song in the table to
            view more information on it. And of course, if I've done a best hit songs video of the
            year-end chart it was on, assuming it was on the list or an honorable mention, you can
            watch that to hear my detailed thoughts on the song.
          </p>
          <p>
            I hope you enjoy checking out this site and seeing my thoughts on various popular music
            throughout the Hot 100's history. And feel free to check out{' '}
            <a
              href="https://www.youtube.com/@NorbertSD"
              className="text-lime-700 hover:text-lime-600 duration-300 underline decoration-solid"
            >
              my YouTube channel
            </a>{' '}
            to see my thoughts on various music, as well as my other interests like animation.
            Enjoy!
          </p>
        </div>
      </div>
    </Modal>
  );
}
