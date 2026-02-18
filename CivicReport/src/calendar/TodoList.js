import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Modal,
    useWindowDimensions,
} from 'react-native';

const TodoList = ({ selectedDate, todos, onAddTodo, onUpdateTodo, onDeleteTodo, onToggleTodo, isLandscape }) => {
    const { width, height } = useWindowDimensions();
    const [newTaskText, setNewTaskText] = useState('');
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState('');

    const dateKey = selectedDate ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : null;
    const dayTodos = todos[dateKey] || [];

    const handleAdd = () => {
        if (newTaskText.trim()) {
            onAddTodo(dateKey, newTaskText.trim());
            setNewTaskText('');
        }
    };

    const handleEdit = (todo) => {
        setEditingTodo(todo);
        setEditText(todo.text);
    };

    const handleSaveEdit = () => {
        if (editText.trim() && editingTodo) {
            onUpdateTodo(dateKey, editingTodo.id, editText.trim());
            setEditingTodo(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingTodo(null);
        setEditText('');
    };

    const formatDate = (date) => {
        if (!date) return 'Виберіть день';
        const formatter = new Intl.DateTimeFormat('uk-UA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        return formatter.format(date);
    };

    return (
        <View style={[styles.container, isLandscape && styles.containerLandscape]}>
            <Text style={[styles.title, isLandscape && styles.titleLandscape]}>
                Задачі на {formatDate(selectedDate)}
            </Text>

            {selectedDate && (
                <>
                    <View style={[styles.inputContainer, isLandscape && styles.inputContainerLandscape]}>
                        <TextInput
                            style={[styles.input, isLandscape && styles.inputLandscape]}
                            placeholder="Додати задачу..."
                            value={newTaskText}
                            onChangeText={setNewTaskText}
                            onSubmitEditing={handleAdd}
                        />
                        <TouchableOpacity
                            style={[styles.addButton, isLandscape && styles.addButtonLandscape]}
                            onPress={handleAdd}
                        >
                            <Text style={[styles.addButtonText, isLandscape && styles.addButtonTextLandscape]}>+</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={dayTodos}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={[styles.todoItem, isLandscape && styles.todoItemLandscape]}>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.editButton, isLandscape && styles.editButtonLandscape]}
                                        onPress={() => handleEdit(item)}
                                    >
                                        <Text style={[styles.actionText, isLandscape && styles.actionTextLandscape]}>✏️</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, isLandscape && styles.emptyTextLandscape]}>
                                Немає задач на цей день
                            </Text>
                        }
                        style={styles.list}
                    />
                </>
            )}

            {!selectedDate && (
                <Text style={[styles.emptyText, isLandscape && styles.emptyTextLandscape]}>
                    Виберіть день для перегляду задач
                </Text>
            )}

            <Modal
                visible={editingTodo !== null}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelEdit}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Редагувати задачу</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editText}
                            onChangeText={setEditText}
                            placeholder="Введіть текст задачі"
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={handleCancelEdit}
                            >
                                <Text style={styles.modalButtonText}>Скасувати</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSave]}
                                onPress={handleSaveEdit}
                            >
                                <Text style={[styles.modalButtonText, styles.modalButtonTextSave]}>Зберегти</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    containerLandscape: {
        padding: 10,
        width: '40%',
        flex: 1,
        maxWidth: '40%',
        borderTopWidth: 0,
        borderLeftWidth: 1,
        borderLeftColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
    },
    titleLandscape: {
        fontSize: 16,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    inputContainerLandscape: {
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    inputLandscape: {
        paddingVertical: 8,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    addButtonLandscape: {
        width: 40,
        height: 40,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButtonTextLandscape: {
        fontSize: 20,
    },
    list: {
        flex: 1,
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    todoItemLandscape: {
        padding: 10,
        marginBottom: 8,
    },
    todoContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007AFF',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLandscape: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
    },
    checkmark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    checkmarkLandscape: {
        fontSize: 12,
    },
    todoText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    todoTextLandscape: {
        fontSize: 14,
    },
    todoTextCompleted: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
    },
    editButton: {
        padding: 5,
        marginLeft: 5,
    },
    editButtonLandscape: {
        padding: 3,
        marginLeft: 3,
    },
    deleteButton: {
        padding: 5,
        marginLeft: 5,
    },
    deleteButtonLandscape: {
        padding: 3,
        marginLeft: 3,
    },
    actionText: {
        fontSize: 18,
    },
    actionTextLandscape: {
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 16,
        marginTop: 20,
    },
    emptyTextLandscape: {
        fontSize: 14,
        marginTop: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
    },
    modalInput: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 15,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginLeft: 10,
    },
    modalButtonCancel: {
        backgroundColor: '#f0f0f0',
    },
    modalButtonSave: {
        backgroundColor: '#007AFF',
    },
    modalButtonText: {
        fontSize: 16,
        color: '#000',
    },
    modalButtonTextSave: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default TodoList;

