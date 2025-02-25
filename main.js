$(document).ready(function() {
    // Initialize DataTables
    const logsTable = $('#logsTable').DataTable({
        order: [[3, 'desc']], // Sort by timestamp by default
        language: {
            search: "Поиск:",
            lengthMenu: "Показать _MENU_ записей",
            info: "Записи с _START_ до _END_ из _TOTAL_",
            infoEmpty: "Записи с 0 до 0 из 0",
            infoFiltered: "(отфильтровано из _MAX_ записей)",
            paginate: {
                first: "Первая",
                last: "Последняя",
                next: "Следующая",
                previous: "Предыдущая"
            }
        }
    });

    const modTable = $('#modTable').DataTable({
        order: [[5, 'desc']], // Sort by timestamp by default
        language: {
            search: "Поиск:",
            lengthMenu: "Показать _MENU_ записей",
            info: "Записи с _START_ до _END_ из _TOTAL_",
            infoEmpty: "Записи с 0 до 0 из 0",
            infoFiltered: "(отфильтровано из _MAX_ записей)",
            paginate: {
                first: "Первая",
                last: "Последняя",
                next: "Следующая",
                previous: "Предыдущая"
            }
        }
    });

    // Handle server and command filters for logs
    $('#serverFilter, #commandFilter').on('change keyup', function() {
        const serverId = $('#serverFilter').val();
        const command = $('#commandFilter').val();

        // Make API call to get filtered logs
        $.get('/api/logs', { 
            server_id: serverId,
            command: command
        })
        .done(function(data) {
            // Clear and reload table
            logsTable.clear();
            data.forEach(function(log) {
                logsTable.row.add([
                    `!${log.command}`,
                    log.server,
                    log.user_id,
                    log.timestamp
                ]);
            });
            logsTable.draw();
        });
    });

    // Handle server and action type filters for moderation
    $('#serverFilter, #actionTypeFilter').on('change', function() {
        const serverId = $('#serverFilter').val();
        const actionType = $('#actionTypeFilter').val();

        // Make API call to get filtered moderation actions
        $.get('/api/mod_actions', { 
            server_id: serverId,
            action_type: actionType
        })
        .done(function(data) {
            // Clear and reload table
            modTable.clear();
            data.forEach(function(action) {
                let actionBadge = '';
                switch(action.action_type) {
                    case 'ban':
                        actionBadge = '<span class="badge bg-danger">Бан</span>';
                        break;
                    case 'kick':
                        actionBadge = '<span class="badge bg-warning">Кик</span>';
                        break;
                    case 'mute':
                        actionBadge = `<span class="badge bg-info">Мут (${Math.floor(action.duration / 60)} мин)</span>`;
                        break;
                    case 'role_add':
                        actionBadge = '<span class="badge bg-success">Выдана роль</span>';
                        break;
                    case 'role_remove':
                        actionBadge = '<span class="badge bg-secondary">Удалена роль</span>';
                        break;
                }

                modTable.row.add([
                    actionBadge,
                    action.server,
                    action.target_user_id,
                    action.moderator_id,
                    action.reason || 'Не указана',
                    action.timestamp
                ]);
            });
            modTable.draw();
        });
    });
});