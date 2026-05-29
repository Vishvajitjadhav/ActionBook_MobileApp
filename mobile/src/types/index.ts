export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple';

export interface Note {
  _id: string;
  title: string;
  body: string;
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type RootStackParamList = {
  Main: undefined;
  EditNote: { note?: Note };
};

export type BottomTabParamList = {
  Home: undefined;
  Archive: undefined;
};
