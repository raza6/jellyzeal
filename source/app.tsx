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
	const [userMedias, setUserMedias] = useState<JellyfinMedia[]>([]);
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
		setUserMedias(userMedias.Items);
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
						: userMedias.length === 0
							? <Text>No media played yet</Text>
							: userMedias.map(m => <Box alignItems="flex-start" key={m.Id}><Text>- {m.Name} ({m.UserData.PlayCount})</Text></Box>)
					}
				</Box>
			</Box>
		</Box>
	);
}
