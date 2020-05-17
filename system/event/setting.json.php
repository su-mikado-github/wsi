<?php
namespace System\Event;

use WSI\Database;
use WSI\DispatchHandler;
use WSI\Request;
use WSI\Resource;
use WSI\Status;

class Setting extends DispatchHandler {
    /**
     *   attribute_type_id
  , attribute_type
  , sort_order
  , attribute_type_name
  , description
  , default_string_value
  , default_text_value
  , default_int_value
  , default_double_value
  , default_date_value
  , default_datetime_value
  , default_time_value
  , default_flag_value
  , default_value_id
  , division_id
  , layer2_division_id
  , layer3_division_id
  , delete_flag
  , create_user
  , create_ms
  , update_user
  , update_ms

     * @param array $row
     * @return []
     */
    protected function user_attribute_binds($row, $sort_order) {
        $attribute_type = $row['attribute_type'];

        $result = [];
        $result['attribute_type_id'] = (empty($row['attribute_type_id']) ? uniqid() : $row['attribute_type_id']);
        $result['attribute_type'] = $attribute_type;
        $result['sort_order'] = $sort_order;
        $result['attribute_type_name'] = $row['attribute_type_name'];
        $result['description'] = $row['description'];
        $result['default_string_value'] = ($attribute_type==1 ? $row['attribute_value'] : null);
        $result['default_text_value'] = ($attribute_type==2 ? $row['attribute_value'] : null);
        $result['default_int_value'] = ($attribute_type==3 ? $row['attribute_value'] : null);
        $result['default_double_value'] = ($attribute_type==4 ? $row['attribute_value'] : null);
        $result['default_date_value'] = ($attribute_type==5 ? $row['attribute_value'] : null);
        $result['default_datetime_value'] = ($attribute_type==6 ? $row['attribute_value'] : null);
        $result['default_time_value'] = ($attribute_type==7 ? $row['attribute_value'] : null);
        $result['default_flag_value'] = ($attribute_type==8 ? $row['attribute_value'] : null);
        $result['default_value_id'] = ($attribute_type==9 ? $row['attribute_value'] : null);
        $result['division_id'] = $row[''];
        $result['layer2_division_id'] = $row[''];
        $result['layer3_division_id'] = $row[''];

        return $result;
    }

    public function __construct() {
        //
    }

    public function default_action(Request $request) {
        //
        $db = Database::connect();

        $sql = Resource::from('/system/m_layer1_divisions/select/all[division_id].sql');
        $division = $db->row($sql, ['division_id'=>'DATA_TYPE']);

        $sql = Resource::from('/system/m_layer1_division_values/select/all[division_id].sql');
        $division_values = $db->rowset($sql, ['division_id'=>'DATA_TYPE']);

//         $sql = Resource::from('/system/m_user_attribute_types/select/all.sql');
//         $list = $db->rowset($sql);
        $list = [];

        return Status::ok()->set_params([
            'list' => $list,
            'division' => $division,
            'division_values' => $division_values
        ]);
    }

    public function save(Request $request) {
        $user_attributes = (empty($_POST['user_attributes']) ? [] : json_decode($_POST['user_attributes']));

        $db = Database::connect();
        $db->begin(function($db) use ($user_attributes) {
            //保存しているデータを削除
            $sql = Resource::from('/system/m_user_attribute_types/delete/all.sql');
            $db->update($sql);

            $row_count = 1;
            array_map(function($row) use(&$row_count) { return $this->user_attribute_binds($row, $row_count++); }, $user_attributes);
        });
    }
}

return Setting::class;
