import React, { useState } from 'react'
import { SpotifyPlayerWidget } from './SpotifyPlayerWidget'
import { Story } from '@storybook/react'

export default {
  title: 'UI/SpotifyPlayerWidget',
  component: SpotifyPlayerWidget,
  argTypes: { onVolumeChange: { action: 'volume changed' }, onResume: { action: 'resume' } },
}

const Template: Story = (args: any) => <SpotifyPlayerWidget {...args} />

export const Default = Template.bind({})

export const Active = Template.bind({})
Active.args = {
  isLoggedIn: true,
  isLoading: false,
  track: {
    name: 'The Sign',
    artists: [{ name: 'Ace of Base' }],
    album: {
      images: [
        {
          url: 'https://cdn.vox-cdn.com/thumbor/BQbwDC4TFweoZIvdvrp5b6wtpiA=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/20009856/Porco_Rosso_963064296_large.jpg',
        },
      ],
    },
  },
}

export const Idle = Template.bind({})
Idle.args = {
  isLoggedIn: true,
  isLoading: false,
}

export const Paused = Template.bind({})
Paused.args = {
  isLoggedIn: true,
  isLoading: false,
  isPaused: true,
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true,
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {
  isLoggedIn: false,
}

export const Error = Template.bind({})
Error.args = {
  error: 'Wrong Authorization Code',
}
