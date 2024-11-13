import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TextEditor = ({ editorData, setEditorData, richText }) => {

    return (
        <View style={styles.container}>
            <RichToolbar
                editor={richText}
                selectedIconTint="#873c1e"
                iconTint="#312921"
                actions={[
                    actions.insertImage,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertBulletsList,
                    actions.insertOrderedList,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.setUnderline,
                ]}
                style={styles.richTextToolbarStyle}
            />
            <RichEditor
                ref={richText}
                onChange={descriptionText => {
                    setEditorData(descriptionText)
                }}
                placeholder="Write your cool content here :)"
                androidHardwareAccelerationDisabled={true}
                style={styles.richTextEditorStyle}
                initialHeight={200}
                initialContentHTML={editorData}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10
    },
    richTextToolbarStyle: {
        backgroundColor: "#c6c3b3",
        borderColor: "#c6c3b3",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderWidth: 1,
    },
    richTextEditorStyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderColor: "#ccaf9b",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        fontSize: 20,
        overflow: "hidden"
    },
});

export default TextEditor