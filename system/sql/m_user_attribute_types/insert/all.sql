insert into m_user_attribute_types (
  attribute_type_id
  , attribute_type
  , sort_order
  , attribute_type_name
  , description
  , division_id
  , layer2_division_id
  , layer3_division_id
  , default_string_value
  , default_text_value
  , default_int_value
  , default_double_value
  , default_date_value
  , default_datetime_value
  , default_time_value
  , default_flag_value
  , default_value_id
  , delete_flag
  , create_user
  , create_ms
  , update_user
  , update_ms
)
select
  :attribute_type_id
  , :attribute_type
  , :sort_order
  , :attribute_type_name
  , :description
  , :division_id
  , :layer2_division_id
  , :layer3_division_id
  , :default_strig_value
  , :default_text_value
  , :default_int_value
  , :default_double_value
  , :default_date_value
  , :default_datetime_value
  , :default_time_value
  , :default_flag_value
  , :default_value_id,
  , 0
  , :user_id
  , UNIX_TIMESTAMP()
  , :user_id
  , UNIX_TIMESTAMP()
