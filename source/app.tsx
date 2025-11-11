import React, { useEffect, useState } from 'react';
import {Box, Newline, Text} from 'ink';
import {Logo} from './components/Logo.js';
import MainService from './services/mainService.js';
import { JellyfinUser } from './types/jellyfinUser.js';
import { JellyfinMedia } from './types/jellyfinMedia.js';
import SelectInput from 'ink-select-input';


type Props = {
};

export default function App({}: Props) {
	const [appHeight, setHeight] = useState(10);
	const [users, setUsers] = useState<JellyfinUser[]>([]);
	const [userMovies, setUserMovies] = useState<JellyfinMedia[]>([]);
	const [userSeries, setUserSeries] = useState<JellyfinMedia[]>([]);
	const [loadingMedias, setLoadingMedias] = useState(false);

	const init = async () => {
		const users = await MainService.getUsers();
		setUsers(users);
  };

  useEffect(() => {
    init();
  }, []);

	useEffect(() => {
		const intervalStatusCheck = setInterval(() => {
			setHeight(10);
		}, 1000);

		return () => {
			clearInterval(intervalStatusCheck);
		};
	}, []);

	const handleHighlightedUser = async (item: any) => {
		setLoadingMedias(true);
		const userMedias = await MainService.getUserMedias(item.value.Id);
		setUserMovies(userMedias.Items.filter(m => m.Type === 'Movie'));
		const userEpisodes = userMedias.Items.filter(m => m.Type === 'Episode');
		const userSeries: JellyfinMedia[] = [];
		console.log(userMedias);
		for (const ep of userEpisodes) {
			const series = userSeries.find(s => s.Id === ep.SeriesId);
			if (series !== undefined) {
				const existingDate = new Date(series.UserData.LastPlayedDate);
				const newDate = new Date(ep.UserData.LastPlayedDate);
				series.UserData.LastPlayedDate = existingDate > newDate ? series.UserData.LastPlayedDate : ep.UserData.LastPlayedDate;
			} else {
				userSeries.push({
					Name: ep.SeriesName ?? '',
					Id: ep.SeriesId ?? '',
					IsFolder: false,
					Type: 'Series',
					UserData: {
						PlayCount: ep.UserData.PlayCount,
						LastPlayedDate: ep.UserData.LastPlayedDate,
						Played: ep.UserData.Played
					},
					SeasonId: undefined,
					SeriesId: undefined,
					SeriesName: undefined
				});
			}
		}
		setUserSeries(userSeries);
		setLoadingMedias(false);
	};
	
	return (
		<Box flexDirection="column" minHeight={appHeight}>
			<Logo/>
			<Newline/>
			<Box
				borderStyle="double"
				borderColor="magenta"
				height="100%"
			>
				<Box flexDirection="column" paddingLeft={1} paddingRight={1}>
					<SelectInput items={users.map(u => {return { label: u.Name, key: u.Id, value: u }})} onHighlight={handleHighlightedUser} />
				</Box>
				<Box flexDirection="column" paddingLeft={1} paddingRight={1}>
					{ loadingMedias
						? <Text>Loading...</Text>
						: (userMovies.length === 0 && userSeries.length === 0)
							? <Text>No media played yet</Text>
							: 
							<Box >
								<Box flexDirection='column'>
									<Text>Movies</Text>
									{userMovies.map(m => <Box alignItems="flex-start" key={m.Id}><Text>- {m.Name} ({new Date(m.UserData.LastPlayedDate).toLocaleDateString()})</Text></Box>)}
								</Box>
								<Box flexDirection='column'>
									<Text>Series</Text>
									{userSeries
										.map(m => <Box alignItems="flex-start" key={m.Id}><Text>- {m.Name} ({new Date(m.UserData.LastPlayedDate).toLocaleDateString()})</Text></Box>)}
								</Box>
							</Box>
					}
				</Box>
			</Box>
		</Box>
	);
}
