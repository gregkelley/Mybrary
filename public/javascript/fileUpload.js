// https://www.npmjs.com/package/filepond

// first have to register all plugins. No docs on this anymore... the fuk.
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
)  // these are the names of the import modules.

// setting size of the book cover in the input box. Using width / height
FilePond.setOptions({
  styleItemPanelAspectRatio: 150 / 100,
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150,
  imageResizeMode: 'contain',
})

// Turn all file input elements into ponds. According to comments, putting a ; at
// the of .parse() breaks it. effing weird. love software.
FilePond.parse(document.body)
